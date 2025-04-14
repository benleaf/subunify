import { isError } from '@/api/isError'
import { StateMachineDispatch } from '@/App'
import { useAuth } from '@/auth/AuthContext'
import moment, { Moment } from 'moment'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import ProgressModal from './modal/ProgressModal'

type UploadSession = { uploadId: string, key: string }

type Props = {
    totalSize: number
    files: File[]
    startUpload: boolean
}
const mb5 = 5 * 1024 * 1024

const FileUploader = ({ totalSize, files, startUpload }: Props) => {
    const { dispatch } = useContext(StateMachineDispatch)!
    const navigate = useNavigate()

    const { authAction } = useAuth()
    const [fileProgress, setFileProgress] = useState(0)
    const [totalProgress, setTotalProgress] = useState(0)
    const [currentFileName, setCurrentFileName] = useState("")
    const [startTime, setStartTime] = useState<Moment>()
    const [eta, setEta] = useState<string>()

    useEffect(() => {
        const now = moment()
        const duration = moment.duration(now.diff(startTime))
        const secondsElapsed = duration.asSeconds()

        const uploadSpeed = totalProgress / secondsElapsed
        const remainingBytes = totalSize - totalProgress
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
            files: files.map(file => ({ name: file.name, description: file.name, size: file.size }))
        }))

        if (isError(uploadSessions)) throw new Error("Failed to start upload session");

        for (const file of files) {
            const uploadSession = uploadSessions.find(session => session.key.includes(file.name))
            if (!uploadSession) throw new Error("Failed to find upload session for file");

            const parts = Math.ceil(file.size / mb5)
            const response = await authAction<{ urls: string[] }>('storage-file/upload/presigned-parts', "POST", JSON.stringify({
                key: uploadSession.key,
                uploadId: uploadSession.uploadId,
                partCount: parts
            }))

            if (isError(response)) throw new Error("Failed to get presigned urls");

            uploadUrls.set(file.name, response.urls)
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

        for (const file of files) {
            setCurrentFileName(file.name)

            let retries = 0
            while (true) {
                try {
                    const uploadSession = uploadSessions.find(session => session.key.includes(file.name))
                    if (!uploadSession) throw new Error("Failed to find upload session for file")

                    const fileUpload = await uploadFile(uploadUrls, file, uploadSession)
                    fileUploads.push(fileUpload)
                    break
                } catch (error) {
                    console.log(error)
                    dispatch({ action: 'popup', data: { colour: 'error', message: `Failed to upload file ${file.name}, retrying...` } })
                }

                retries++

                if (retries > 10) {
                    dispatch({ action: 'popup', data: { colour: 'error', message: `Failed to upload file ${file.name}, please try again later` } })
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
            setTotalProgress(old => old + chunk.bytes)
        }

        return {
            uploadId: uploadSession.uploadId,
            key: uploadSession.key,
            parts
        }
    }
    return <ProgressModal
        fileProgress={fileProgress}
        totalProgress={(totalProgress / totalSize) * 100}
        currentFileName={currentFileName}
        eta={eta}
    />
}

export default FileUploader