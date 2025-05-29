import { TaggedFile } from "@/pages/FileUpload"
import { Stack, LinearProgress, CircularProgress, Alert, Chip } from "@mui/material"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useNavigate } from "react-router"
import { useAuth } from "@/contexts/AuthContext"
import moment, { Moment } from "moment"
import { useState, useEffect, useRef } from "react"
import { isError } from "@/api/isError"
import { Time } from "@/helpers/Time"
import GlassCard from "../glassmorphism/GlassCard"
import { CssSizes } from "@/constants/CssSizes"

type Props = {
    taggedFiles: TaggedFile[]
}

type ChunkUploadResult = {
    response: Promise<Response>,
    chunk: Chunk,
}

type FileUploadPart = {
    ETag: string
    PartNumber: number
}

type FileUploadResult = {
    uploadId: string
    key: string
    parts: FileUploadPart[]
}

type Chunk = { blob: Blob, url: string, bytes: number }

type UploadSession = { uploadId: string, key: string, file: File, description: string }

type UploadObject = { url: string, uploadSession: UploadSession, index: number }

const mb5 = 5 * 1024 * 1024

const MAX_UPLOAD_CONCURRENCY = 3;
const MAX_STAGING_SIZE = 100;

const Uploader2 = ({ taggedFiles }: Props) => {
    const fileRecords = taggedFiles.map(file => ({ ...file, description: file.tags.join() }))
    const navigate = useNavigate()
    const { authAction } = useAuth()

    const started = useRef<'waiting' | 'gettingParts' | 'inProgress'>('waiting');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const totalUploaded = useRef(0);
    const startTime = useRef<Moment>(moment());
    const uploadSessions = useRef<UploadSession[]>();
    const stagingQueue = useRef<UploadObject[]>([]);
    const uploadQueue = useRef<Promise<Response>[]>([]);
    const finished = useRef<FileUploadResult[]>([]);

    const [filesInUpload, setFilesInUpload] = useState(new Map<string, { total: number, current: number, percentage: number }>())
    const [eta, setEta] = useState<string>()
    const [mbps, setMbps] = useState<number>()

    const totalSize = fileRecords.length ? fileRecords.map(fileRecord => fileRecord.file.size).reduce((acc, cur) => acc + cur) : 0
    const totalProgress = (totalUploaded.current / totalSize) * 100

    useEffect(() => {
        if (totalUploaded.current == 0) return

        const now = moment()
        const duration = moment.duration(now.diff(startTime.current))
        const secondsElapsed = duration.asSeconds()

        const uploadSpeed = totalUploaded.current / secondsElapsed
        setMbps((uploadSpeed * 8) / 1024 / 1024)
        const remainingBytes = totalSize - totalUploaded.current
        const estimatedSecondsLeft = remainingBytes / uploadSpeed

        setEta(Time.formatDate(moment().add(estimatedSecondsLeft, 'seconds')))
    }, [filesInUpload])

    useEffect(() => {
        const abortController = new AbortController()
        console.log(uploadSessions.current?.length, started.current)
        if (!intervalRef.current?.hasRef()) {
            getUploadSessions(fileRecords)
        }

        return () => {
            console.log("Cleaning up AuthContext");
            abortController.abort()
        };
    }, [])

    useEffect(() => {
        if (!uploadSessions.current || uploadSessions.current.length === 0 || started.current != 'waiting') return
        startTime.current = moment()

        intervalRef.current = setInterval(() => {
            void checkQueues()
        }, 100)
    }, [uploadSessions.current != undefined])

    const getUploadSessions = async (fileRecords: { file: File, description: string }[]) => {
        console.log("Getting upload sessions")
        const newUploadSessions = await authAction<UploadSession[]>('storage-file/upload/start', "POST", JSON.stringify({
            files: fileRecords.map(fileRecord => ({
                name: fileRecord.file.name,
                description: fileRecord.description,
                size: fileRecord.file.size
            }))
        }))

        if (isError(newUploadSessions)) {
            console.error(uploadSessions)
            throw new Error("Failed to start upload session")
        }

        for (const uploadSession of newUploadSessions) {
            const fileRecord = fileRecords.find(fileRecord => uploadSession.key.includes(fileRecord.file.name))
            if (!fileRecord) throw new Error(`Failed to find file record for upload session ${uploadSession.key}`)
            uploadSession.file = fileRecord.file
            uploadSession.description = fileRecord.description
        }

        console.log(`Adding ${newUploadSessions.length} upload sessions`)
        if (uploadSessions.current == undefined) {
            uploadSessions.current = newUploadSessions
        } else {
            uploadSessions.current!.push(...newUploadSessions)
        }
    }

    const getPresignedUrls = async (uploadSession: UploadSession): Promise<UploadObject[]> => {
        if (!uploadSession) throw new Error("Failed to find upload session for file");

        const parts = Math.ceil(uploadSession.file.size / mb5)
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
        return response.urls.map((url, index) => ({ url, uploadSession, index }))
    }

    const getUploadChunk = (file: File, uploadUrl: string, index: number): Chunk => {
        const start = index * mb5;
        const end = Math.min(file.size, (index + 1) * mb5);
        const blob = file.slice(start, end);
        return { blob, url: uploadUrl, bytes: end - start }
    }

    const checkQueues = async () => {
        if (!uploadSessions.current) return
        // Fill staging queue
        while (started.current != 'gettingParts' && stagingQueue.current.length < MAX_STAGING_SIZE && uploadSessions.current.length > 0) {
            const uploadSession = uploadSessions.current.shift()!
            started.current = 'gettingParts'
            const uploadObjects = await getPresignedUrls(uploadSession);
            started.current = 'inProgress'
            stagingQueue.current.push(...uploadObjects);
            console.log("Staging queue", stagingQueue.current)
        }

        // Fill upload queue
        while (uploadQueue.current.length < MAX_UPLOAD_CONCURRENCY && stagingQueue.current.length > 0) {
            const uploadObj = stagingQueue.current.shift()!;
            console.log("Filling upload queue", uploadObj.index, uploadObj.url)
            const chunkUploadResult = uploadFile(uploadObj)
            chunkUploadResult.response.finally(() => {
                // Remove resolved promise
                uploadQueue.current = uploadQueue.current.filter(p => p !== chunkUploadResult.response);
            })

            handlePartUpload(uploadObj, chunkUploadResult)
            uploadQueue.current.push(chunkUploadResult.response);
        }

        if (
            started.current &&
            uploadSessions.current?.length === 0 &&
            stagingQueue.current.length === 0 &&
            uploadQueue.current.length === 0
        ) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            console.log('All uploads complete');
            await authAction<{ urls: string[] }>('storage-file/upload/complete', "POST", JSON.stringify({ fileUploads: finished.current }))
            navigate('/deep-storage')
        }
    };

    const uploadFile = (uploadObject: UploadObject): ChunkUploadResult => {
        const chunk = getUploadChunk(uploadObject.uploadSession.file, uploadObject.url, uploadObject.index)
        const result = uploadChunk(chunk)
        return { response: result, chunk }
    }

    const handlePartUpload = async (uploadObj: UploadObject, { chunk, response }: ChunkUploadResult) => {
        response.then(async (result) => {
            const key = uploadObj.uploadSession.file.name

            totalUploaded.current += chunk.bytes
            setFilesInUpload(old => old.set(key, {
                total: uploadObj.uploadSession.file.size,
                current: (old.get(key)?.current ?? 0) + chunk.bytes,
                percentage: ((old.get(key)?.current ?? 0) + chunk.bytes) / uploadObj.uploadSession.file.size * 100
            }))

            const uploadSessionKey = uploadObj.uploadSession.key
            const finishedParts = finished.current.find(upload => upload.key === uploadSessionKey)

            if (finishedParts) {
                finishedParts.parts.push({ ETag: result.headers.get('ETag')!, PartNumber: uploadObj.index + 1 })
            } else {
                finished.current.push({
                    uploadId: uploadObj.uploadSession.uploadId,
                    key: uploadSessionKey,
                    parts: [{ ETag: result.headers.get('ETag')!, PartNumber: uploadObj.index + 1 }]
                })
            }
        })
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

export default Uploader2