import { TaggedFile } from "@/pages/FileUpload"
import { Stack, LinearProgress, CircularProgress, Alert, Chip } from "@mui/material"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useNavigate } from "react-router"
import { StateMachineDispatch } from "@/App"
import { useAuth } from "@/auth/AuthContext"
import moment, { Moment } from "moment"
import { useContext, useState, useEffect } from "react"
import { isError } from "@/api/isError"
import { Time } from "@/helpers/Time"
import GlassCard from "../glassmorphism/GlassCard"
import { CssSharp } from "@mui/icons-material"
import { CssSizes } from "@/constants/CssSizes"

type Props = {
    taggedFiles: TaggedFile[]
}

type UploadSession = { uploadId: string, key: string }

const mb5 = 5 * 1024 * 1024

const Uploader = ({ taggedFiles }: Props) => {
    const fileRecords = taggedFiles.map(file => ({ ...file, description: file.tags.join() }))

    const { dispatch } = useContext(StateMachineDispatch)!
    const navigate = useNavigate()

    const { authAction } = useAuth()
    const [totalUploaded, setTotalUploaded] = useState(0)
    const [startTime, setStartTime] = useState<Moment>()
    const [eta, setEta] = useState<string>()
    const [filesInUpload, setFilesInUpload] = useState(new Map<string, { total: number, current: number, percentage: number }>())
    const [mbps, setMbps] = useState<number>()

    const totalSize = fileRecords.length ? fileRecords.map(fileRecord => fileRecord.file.size).reduce((acc, cur) => acc + cur) : 0
    const totalProgress = (totalUploaded / totalSize) * 100

    useEffect(() => {
        if (totalUploaded == 0) return

        const now = moment()
        const duration = moment.duration(now.diff(startTime))
        const secondsElapsed = duration.asSeconds()

        const uploadSpeed = totalUploaded / secondsElapsed
        setMbps((uploadSpeed * 8) / 1024 / 1024)
        const remainingBytes = totalSize - totalUploaded
        const estimatedSecondsLeft = remainingBytes / uploadSpeed

        setEta(Time.formatDate(moment().add(estimatedSecondsLeft, 'seconds')))
    }, [totalProgress])

    useEffect(() => {
        const abortController = new AbortController()
        const { signal } = abortController
        uploadFiles(signal)
        return () => {
            console.log("Cleaning up AuthContext");
            abortController.abort()
        };
    }, [])

    const getUploadSessions = async (fileRecords: { file: File, description: string }[]) => {
        const uploadSessions = await authAction<UploadSession[]>('storage-file/upload/start', "POST", JSON.stringify({
            files: fileRecords.map(fileRecord => ({
                name: fileRecord.file.name,
                description: fileRecord.description,
                size: fileRecord.file.size
            }))
        }))

        if (isError(uploadSessions)) {
            console.error(uploadSessions)
            throw new Error("Failed to start upload session")
        }
        console.log("uploadSessions", uploadSessions)
        return uploadSessions
    }

    const getPresignedUrls = async (uploadSession: UploadSession, fileRecord: { file: File, description: string }) => {
        if (!uploadSession) throw new Error("Failed to find upload session for file");

        const parts = Math.ceil(fileRecord.file.size / mb5)
        const response = await authAction<{ urls: string[] }>('storage-file/upload/presigned-parts', "POST", JSON.stringify({
            key: uploadSession.key,
            uploadId: uploadSession.uploadId,
            partCount: parts
        }))

        if (isError(response)) {
            console.error(response)
            throw new Error("Failed to get presigned urls")
        }

        console.log("response.urls", response.urls)
        return response.urls
    }

    type Chunk = { blob: Blob, url: string, bytes: number }
    const getUploadChunk = (file: File, uploadUrl: string, index: number): Chunk => {
        const start = index * mb5;
        const end = Math.min(file.size, (index + 1) * mb5);
        const blob = file.slice(start, end);
        return { blob, url: uploadUrl, bytes: end - start }
    }

    const uploadFiles = async (signal: AbortSignal): Promise<void> => {
        console.log("UPLOAD START")
        if (signal.aborted) return
        const uploadSessions = await getUploadSessions(fileRecords)

        const parts = new Map<string, { ETag: string, PartNumber: number }[]>()
        const fileUploadBatchResults: {
            response: Promise<Response | undefined>,
            index: number,
            uploadSession: UploadSession,
            bytesInFile: number,
            uploadedBytes: number,
            fileName: string,
        }[] = []
        const pendingUrlData: { url: string, uploadSession: UploadSession, index: number, totalInFile: number }[] = []

        setStartTime(moment())

        for (const fileRecord of fileRecords) {
            if (signal.aborted) return
            const uploadSession = uploadSessions.find(session => session.key.includes(fileRecord.file.name))
            if (!uploadSession) throw new Error("Failed to find upload session for file")

            const uploadUrls = await getPresignedUrls(uploadSession, fileRecord)
            console.log("Total Urls for:", fileRecord.file.name, uploadUrls.length)


            for (const index in uploadUrls) {
                pendingUrlData.push({
                    url: uploadUrls[index],
                    uploadSession,
                    index: +index,
                    totalInFile: uploadUrls.length
                })
            }

            while (pendingUrlData.length > 10) {
                console.log("Pending urls:", pendingUrlData)

                if (signal.aborted) return

                for (let index = 0; index < 10; index++) {
                    const pendingUrl = pendingUrlData.pop()!
                    const chunk = getUploadChunk(fileRecord.file, pendingUrl.url, pendingUrl.index)
                    const response = uploadChunk(chunk)

                    fileUploadBatchResults.push({
                        response,
                        fileName: fileRecord.file.name,
                        index: pendingUrl.index,
                        uploadedBytes: chunk.bytes,
                        bytesInFile: fileRecord.file.size,
                        uploadSession: pendingUrl.uploadSession
                    })
                }

                const resolvedFileUploads = await Promise.all(fileUploadBatchResults.map(async fileUploadBatchResult => {
                    const response = await fileUploadBatchResult.response
                    const key = fileUploadBatchResult.fileName
                    setFilesInUpload(old => {
                        return old.set(key, {
                            total: fileUploadBatchResult.bytesInFile,
                            current: (old.get(key)?.current ?? 0) + fileUploadBatchResult.uploadedBytes,
                            percentage: ((old.get(key)?.current ?? 0) + fileUploadBatchResult.uploadedBytes) / fileUploadBatchResult.bytesInFile * 100
                        })
                    })
                    setTotalUploaded(old => old + fileUploadBatchResult.uploadedBytes)
                    return { ...fileUploadBatchResult, response }
                }))

                for (const fileUploadBatchResult of resolvedFileUploads) {
                    console.log(fileUploadBatchResult.fileName, fileUploadBatchResult.index,)
                    const resultUploadSessionKey = fileUploadBatchResult.uploadSession.key
                    if (!fileUploadBatchResult.response) throw new Error(`Failed to upload file, no response returned`)

                    const etag = fileUploadBatchResult.response.headers.get('ETag');
                    if (!etag) throw new Error(`Failed to upload file, no ETag returned`);
                    const oldParts = parts.get(resultUploadSessionKey) ?? []
                    parts.set(resultUploadSessionKey, [...oldParts, { ETag: etag, PartNumber: fileUploadBatchResult.index + 1 }])
                }

                fileUploadBatchResults.length = 0
            }
        }

        const fileUploads: ({
            uploadId: string
            key: string
            parts: {
                ETag: string
                PartNumber: number
            }[]
        } | undefined)[] = []

        for (const uploadSession of uploadSessions) {
            fileUploads.push({
                uploadId: uploadSession.uploadId,
                key: uploadSession.key,
                parts: parts.get(uploadSession.key) ?? []
            })
        }

        await Promise.all(fileUploads)
        await authAction<{ urls: string[] }>('storage-file/upload/complete', "POST", JSON.stringify({ fileUploads }))
        navigate('/deep-storage')
    }

    const uploadChunk = async (chunk: Chunk) => {
        return fetch(chunk.url, {
            method: 'PUT',
            body: chunk.blob,
        })
    }

    return <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <GlassSpace size="big">
            <Stack spacing={2}>
                {totalProgress < 100 && <GlassCard marginSize="big" paddingSize="big">
                    <GlassText size="moderate">
                        <CircularProgress size={CssSizes.moderate} /> Total Progress
                    </GlassText>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <LinearProgress value={totalProgress} variant="determinate" style={{ flex: 1 }} />
                        <GlassText size="moderate">
                            {totalProgress.toFixed(1)}%
                        </GlassText>
                    </Stack>
                    {mbps && <Chip label={`${mbps.toFixed(1)} Mbps`} style={{ marginTop: '1em' }} />}
                    {eta && <Chip label={`Approximately ${eta} remaining`} style={{ marginTop: '1em' }} />}
                </GlassCard>}
                <Alert severity='info'>
                    Upload in progress, please do not close the tab or refresh.
                </Alert>
                {Array.from(filesInUpload, ([fileName, { percentage }]) => ({ fileName, percentage })).map(({ fileName, percentage }) => <div>
                    <GlassText size="moderate">{fileName}</GlassText>
                    <LinearProgress value={percentage ?? 0} variant="determinate" style={{ width: 500 }} />
                </div>
                )}
            </Stack>
            {totalProgress == 100 && <>
                <CircularProgress />
            </>}
        </GlassSpace>

    </div>
}

export default Uploader