import { isError } from '@/api/isError'
import { StateMachineDispatch } from '@/App'
import { useAuth } from '@/contexts/AuthContext'
import moment, { Moment } from 'moment'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Stack, LinearProgress, CircularProgress, Alert } from '@mui/material'
import GlassSpace from '../glassmorphism/GlassSpace'
import GlassText from '../glassmorphism/GlassText'
import BaseModal from './BaseModal'

type UploadSession = { uploadId: string, key: string }
type FileRecord = { file: File, description: string }

type Props = {
    fileRecords: FileRecord[]
    startUpload: boolean
}
const mb5 = 5 * 1024 * 1024

const FileUploadModal = ({ fileRecords, startUpload }: Props) => {
    const { dispatch } = useContext(StateMachineDispatch)!
    const navigate = useNavigate()

    const { authAction } = useAuth()
    const [fileProgress, setFileProgress] = useState(0)
    const [totalUploaded, setTotalUploaded] = useState(0)
    const [currentFileName, setCurrentFileName] = useState("")
    const [startTime, setStartTime] = useState<Moment>()
    const [eta, setEta] = useState<string>()

    const totalSize = fileRecords.length ? fileRecords.map(fileRecord => fileRecord.file.size).reduce((acc, cur) => acc + cur) : 0
    const totalProgress = (totalUploaded / totalSize) * 100

    useEffect(() => {
        if (totalUploaded == 0) return

        const now = moment()
        const duration = moment.duration(now.diff(startTime))
        const secondsElapsed = duration.asSeconds()

        const uploadSpeed = totalUploaded / secondsElapsed
        const remainingBytes = totalSize - totalUploaded
        const estimatedSecondsLeft = remainingBytes / uploadSpeed

        setEta(moment.duration(estimatedSecondsLeft, 'seconds').humanize())
    }, [fileProgress])

    useEffect(() => {
        if (startUpload) uploadFiles()
    }, [startUpload])

    const uploadFiles = async (): Promise<void> => {
        // Add nominal amount to progress to show progress bar
        setFileProgress(0.01)

        const uploadUrls: Map<string, string[]> = new Map()

        const uploadSessions = await authAction<UploadSession[]>('storage-file/upload/start', "POST", JSON.stringify({
            files: fileRecords.map(fileRecord => ({
                name: fileRecord.file.name,
                description: fileRecord.description,
                size: fileRecord.file.size
            }))
        }))

        if (isError(uploadSessions)) throw new Error("Failed to start upload session");

        for (const fileRecord of fileRecords) {
            const uploadSession = uploadSessions.find(session => session.key.includes(fileRecord.file.name))
            if (!uploadSession) throw new Error("Failed to find upload session for file");

            const parts = Math.ceil(fileRecord.file.size / mb5)
            const response = await authAction<{ urls: string[] }>('storage-file/upload/presigned-parts', "POST", JSON.stringify({
                key: uploadSession.key,
                uploadId: uploadSession.uploadId,
                partCount: parts
            }))

            if (isError(response)) throw new Error("Failed to get presigned urls");

            uploadUrls.set(fileRecord.file.name, response.urls)
        }

        const fileUploads: {
            uploadId: string
            key: string
            parts: {
                ETag: string
                PartNumber: number
            }[]
        }[] = []

        setStartTime(moment())

        for (const fileRecord of fileRecords) {
            setCurrentFileName(fileRecord.file.name)

            let retries = 0
            while (true) {
                try {
                    const uploadSession = uploadSessions.find(session => session.key.includes(fileRecord.file.name))
                    if (!uploadSession) throw new Error("Failed to find upload session for file")

                    const fileUpload = await uploadFile(uploadUrls, fileRecord.file, uploadSession)
                    fileUploads.push(fileUpload)
                    break
                } catch (error) {
                    console.log(error)
                    dispatch({ action: 'popup', data: { colour: 'error', message: `Failed to upload file ${fileRecord.file.name}, retrying...` } })
                }

                retries++

                if (retries > 10) {
                    dispatch({ action: 'popup', data: { colour: 'error', message: `Failed to upload file ${fileRecord.file.name}, please try again later` } })
                    break
                }
            }
        }

        await authAction<{ urls: string[] }>('storage-file/upload/complete', "POST", JSON.stringify({ fileUploads }))
        navigate('/deep-storage')
    }

    const uploadFile = async (uploadUrls: Map<string, string[]>, file: File, uploadSession: UploadSession) => {
        setFileProgress(0.01)
        let fileBytesUploaded = 0

        const urls = uploadUrls.get(file.name)
        if (!urls) throw new Error("Failed to find upload urls for file");

        const parts: {
            ETag: string
            PartNumber: number
        }[] = [];

        const uploadChunks: {
            blob: Blob
            url: string
            bytes: number
            partNumber: number
        }[] = [];

        for (let i = 0; i < urls.length; i++) {
            const start = i * mb5;
            const end = Math.min(file.size, (i + 1) * mb5);
            const blob = file.slice(start, end);
            uploadChunks.push({ blob, url: urls[i], bytes: end - start, partNumber: i + 1 });
        }

        for (const chunk of uploadChunks) {
            const res = await fetch(chunk.url, {
                method: 'PUT',
                body: chunk.blob,
            });

            const etag = res.headers.get('ETag');
            if (!etag) throw new Error(`Failed to upload file ${file.name} , no ETag returned`);
            parts.push({ ETag: etag, PartNumber: chunk.partNumber });

            fileBytesUploaded += chunk.bytes
            setFileProgress((fileBytesUploaded / file.size) * 100)
            setTotalUploaded(old => old + chunk.bytes)
        }

        return {
            uploadId: uploadSession.uploadId,
            key: uploadSession.key,
            parts
        }
    }
    return <BaseModal state={fileProgress > 0 ? 'open' : 'closed'}>
        <GlassSpace size="big">
            {(fileProgress < 100 || totalProgress < 100) && <>
                <GlassText size="moderate">
                    {currentFileName}
                </GlassText>
                <Stack direction="row" spacing={2} alignItems="center">
                    <LinearProgress value={fileProgress} variant="determinate" style={{ flex: 1 }} />
                    <GlassText size="moderate">
                        {fileProgress.toFixed(1)}%
                    </GlassText>
                </Stack>
                <GlassText size="moderate">
                    Total Progress
                </GlassText>
                <Stack direction="row" spacing={2} alignItems="center">
                    <LinearProgress value={totalProgress} variant="determinate" style={{ flex: 1 }} />
                    <GlassText size="moderate">
                        {totalProgress.toFixed(1)}%
                    </GlassText>
                </Stack>
                {eta && <GlassText size="moderate">
                    Approximately {eta} remaining
                </GlassText>}
            </>}
            {fileProgress == 100 && totalProgress == 100 && <>
                <CircularProgress />
            </>}
        </GlassSpace>
        <Alert severity='info'>
            Upload in progress, please do not close the tab or refresh.
        </Alert>
    </BaseModal>
}

export default FileUploadModal