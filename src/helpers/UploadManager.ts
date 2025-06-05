import { isError } from "@/api/isError"
import { ApiError } from "@/types/server/ApiError"
import { RequestMethod } from "@/types/server/RequestMethod"

const mb5 = 5 * 1024 * 1024
const MAX_STAGING_SIZE = 30

export type UploadObject = { url: string, uploadSession: UploadSession, index: number }
export type UploadSession = { uploadId: string, key: string, file: File, description: string }
export type Chunk = { blob: Blob, url: string, bytes: number }
export type ChunkUploadResult = { response: Promise<Response>, chunk: Chunk }
export type FileUploadPart = { ETag: string, PartNumber: number }
export type FileUploadResult = { uploadId: string, key: string, fileName: string, totalParts: number, parts: FileUploadPart[] }
export type FileRecord = { file: File, description: string, projectId: string }

class UploadManager {
    fileRecords: FileRecord[] = []
    uploadSessions: UploadSession[] = []
    stagingQueue: UploadObject[] = []
    uploadQueue: Promise<Response>[] = []
    finished: FileUploadResult[] = []
    isRunning = false
    isAddingToStaging = false
    isAddingToSessions = false
    maxConcurrentUploads = 30
    authAction: <T>(endpoint: string, method: RequestMethod, body?: string | FormData) => Promise<T | Partial<ApiError>>
    fileUploadFinished: (fileName: string) => void
    setTotalUploaded: (cb: (prev: number) => number) => void
    onComplete: () => void

    constructor(authAction: any, setTotalUploaded: any, onComplete: () => void, fileUploadFinished: (fileName: string) => void) {
        this.authAction = authAction
        this.setTotalUploaded = setTotalUploaded
        this.onComplete = onComplete
        this.fileUploadFinished = fileUploadFinished
    }

    async start(fileRecords: FileRecord[]) {
        this.fileRecords = fileRecords
        this.loop()
        this.isRunning = true
    }

    async update(fileRecords: FileRecord[]) {
        this.fileRecords = fileRecords
    }

    async setConcurrentUploads(concurrentUploads: number) {
        this.maxConcurrentUploads = concurrentUploads
    }

    async cancel() {
        this.isRunning = false
        this.uploadSessions = []
        this.stagingQueue = []
        this.uploadQueue = []
        this.finished = []
        this.fileRecords = []
    }

    async getUploadSession(fileRecord: FileRecord): Promise<UploadSession> {
        const getSession = await this.authAction<UploadSession>(
            'storage-file/upload/start',
            "POST",
            JSON.stringify({
                projectId: fileRecord.projectId,
                fileLastModified: new Date(fileRecord.file.lastModified),
                name: fileRecord.file.name,
                size: fileRecord.file.size,
                description: fileRecord.description
            })
        )

        if (isError(getSession)) throw new Error("Failed to start upload session")
        return {
            ...getSession,
            description: fileRecord.description,
            file: fileRecord.file
        }
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
        if (!this.isRunning || this.isAddingToSessions || this.isAddingToStaging) return

        console.log(this.uploadSessions.length, this.fileRecords.length)

        while (!this.isAddingToSessions && this.uploadSessions.length == 0 && this.fileRecords.length > 0) {
            this.isAddingToSessions = true
            const nextFile = this.fileRecords.pop()
            if (!nextFile) continue
            const nextSession = await this.getUploadSession(nextFile)
            this.uploadSessions.push(nextSession)
            this.isAddingToSessions = false
        }

        while (!this.isAddingToStaging && this.stagingQueue.length < MAX_STAGING_SIZE && this.uploadSessions.length > 0) {
            this.isAddingToStaging = true
            const uploadSession = this.uploadSessions.shift()!
            const uploadObjects = await this.getPresignedUrls(uploadSession)
            this.stagingQueue.push(...uploadObjects)
            this.isAddingToStaging = false
        }

        while (this.uploadQueue.length < this.maxConcurrentUploads && this.stagingQueue.length > 0) {
            const uploadObj = this.stagingQueue.shift()!
            console.log("Filling upload queue", uploadObj.index, uploadObj.url)
            const result = this.uploadChunk(this.getUploadChunk(uploadObj.uploadSession.file, uploadObj.url, uploadObj.index))
            result.finally(() => {
                this.uploadQueue = this.uploadQueue.filter(p => p !== result)
            })
            this.handlePartUpload(uploadObj, result)
            this.uploadQueue.push(result)
        }

        if (this.finished.length > 0 && this.finished[0].parts.length == this.finished[0].totalParts) {
            this.fileUploadFinished(this.finished[0].fileName)
            await this.authAction('storage-file/upload/complete', "POST", JSON.stringify(this.finished.shift()))
        }
    }

    uploadChunk(chunk: Chunk): Promise<Response> {
        return fetch(chunk.url, { method: 'PUT', body: chunk.blob })
    }

    async handlePartUpload(uploadObj: UploadObject, response: Promise<Response>) {
        const result = await response
        const fileName = uploadObj.uploadSession.file.name
        this.setTotalUploaded(old => old + (uploadObj.uploadSession.file.size / Math.ceil(uploadObj.uploadSession.file.size / mb5)))
        const ETag = result.headers.get('ETag')!
        const existing = this.finished.find(f => f.fileName === fileName)

        if (existing) {
            existing.parts.push({ ETag, PartNumber: uploadObj.index + 1 })
            existing.parts.sort((a, b) => a.PartNumber - b.PartNumber)
        } else {
            this.finished.push({
                uploadId: uploadObj.uploadSession.uploadId,
                fileName: uploadObj.uploadSession.file.name,
                key: uploadObj.uploadSession.key,
                totalParts: Math.ceil(uploadObj.uploadSession.file.size / mb5),
                parts: [{ ETag, PartNumber: uploadObj.index + 1 }]
            })
        }
    }
}

export default UploadManager