import { isError } from "@/api/isError"
import { ApiError } from "@/types/server/ApiError"
import { RequestMethod } from "@/types/server/RequestMethod"

const mb5 = 5 * 1024 * 1024
const MAX_UPLOAD_CONCURRENCY = 300
const MAX_STAGING_SIZE = 30

export type UploadObject = { url: string, uploadSession: UploadSession, index: number }
export type UploadSession = { uploadId: string, key: string, file: File, description: string }
export type Chunk = { blob: Blob, url: string, bytes: number }
export type ChunkUploadResult = { response: Promise<Response>, chunk: Chunk }
export type FileUploadPart = { ETag: string, PartNumber: number }
export type FileUploadResult = { uploadId: string, key: string, parts: FileUploadPart[] }

class UploadManager {
    fileRecords: { file: File, description: string }[] = []
    uploadSessions: UploadSession[] = []
    stagingQueue: UploadObject[] = []
    uploadQueue: Promise<Response>[] = []
    finished: FileUploadResult[] = []
    isRunning = false
    isAddingToStaging = false
    authAction: <T>(endpoint: string, method: RequestMethod, body?: string | FormData) => Promise<T | Partial<ApiError>>
    setProgress: (key: string, bytes: number, total: number) => void
    setTotalUploaded: (cb: (prev: number) => number) => void
    onComplete: () => void

    constructor(authAction: any, setProgress: any, setTotalUploaded: any, onComplete: () => void) {
        this.authAction = authAction
        this.setProgress = setProgress
        this.setTotalUploaded = setTotalUploaded
        this.onComplete = onComplete
    }

    async start(fileRecords: { file: File, description: string }[]) {
        this.fileRecords = fileRecords
        this.uploadSessions = await this.getUploadSessions()
        this.loop()
        this.isRunning = true
    }

    async cancel() {
        this.isRunning = false
        this.uploadSessions = []
        this.stagingQueue = []
        this.uploadQueue = []
        this.finished = []
        this.fileRecords = []
    }

    async getUploadSessions(): Promise<UploadSession[]> {
        const sessions = await this.authAction<UploadSession[]>(
            'storage-file/upload/start',
            "POST",
            JSON.stringify({
                files: this.fileRecords.map(({ file, description }) => ({
                    name: file.name,
                    size: file.size,
                    description
                }))
            })
        )

        if (isError(sessions)) throw new Error("Failed to start upload sessions")
        return sessions.map(s => ({ ...s, file: this.fileRecords.find(f => s.key.includes(f.file.name))!.file }))
    }

    async loop() {
        const interval = setInterval(async () => {
            await this.checkQueues()
            if (!this.isRunning) clearInterval(interval)
        }, 100)
    }

    async getPresignedUrls(uploadSession: UploadSession): Promise<UploadObject[]> {
        const parts = Math.ceil(uploadSession.file.size / mb5)
        const response = await this.authAction<{ urls: string[] }>('storage-file/upload/presigned-parts', "POST", JSON.stringify({
            key: uploadSession.key,
            uploadId: uploadSession.uploadId,
            partCount: parts
        }))
        if (isError(response)) throw new Error("Failed to get presigned urls")
        return response.urls.map((url, index) => ({ url, uploadSession, index }))
    }

    getUploadChunk(file: File, uploadUrl: string, index: number): Chunk {
        const start = index * mb5
        const end = Math.min(file.size, (index + 1) * mb5)
        return { blob: file.slice(start, end), url: uploadUrl, bytes: end - start }
    }

    async checkQueues() {
        if (!this.isRunning) return

        while (!this.isAddingToStaging && this.stagingQueue.length < MAX_STAGING_SIZE && this.uploadSessions.length > 0) {
            this.isAddingToStaging = true
            const uploadSession = this.uploadSessions.shift()!
            const uploadObjects = await this.getPresignedUrls(uploadSession)
            this.stagingQueue.push(...uploadObjects)
            this.isAddingToStaging = false
        }

        while (this.uploadQueue.length < MAX_UPLOAD_CONCURRENCY && this.stagingQueue.length > 0) {
            const uploadObj = this.stagingQueue.shift()!
            console.log("Filling upload queue", uploadObj.index, uploadObj.url)
            const result = this.uploadChunk(this.getUploadChunk(uploadObj.uploadSession.file, uploadObj.url, uploadObj.index))
            result.finally(() => {
                this.uploadQueue = this.uploadQueue.filter(p => p !== result)
            })
            this.handlePartUpload(uploadObj, result)
            this.uploadQueue.push(result)
        }

        if (
            !this.isAddingToStaging &&
            this.uploadSessions.length === 0 &&
            this.stagingQueue.length === 0 &&
            this.uploadQueue.length === 0
        ) {
            this.isRunning = false
            await this.authAction('storage-file/upload/complete', "POST", JSON.stringify({ fileUploads: this.finished }))
            this.onComplete()
        }
    }

    uploadChunk(chunk: Chunk): Promise<Response> {
        return fetch(chunk.url, { method: 'PUT', body: chunk.blob })
    }

    async handlePartUpload(uploadObj: UploadObject, response: Promise<Response>) {
        const result = await response
        const key = uploadObj.uploadSession.file.name
        this.setTotalUploaded(old => old + (uploadObj.uploadSession.file.size / Math.ceil(uploadObj.uploadSession.file.size / mb5)))
        this.setProgress(key, (uploadObj.index + 1) * mb5, uploadObj.uploadSession.file.size)
        const ETag = result.headers.get('ETag')!
        const existing = this.finished.find(f => f.key === key)
        if (existing) {
            existing.parts.push({ ETag, PartNumber: uploadObj.index + 1 })
        } else {
            this.finished.push({ uploadId: uploadObj.uploadSession.uploadId, key, parts: [{ ETag, PartNumber: uploadObj.index + 1 }] })
        }
    }
}

export default UploadManager