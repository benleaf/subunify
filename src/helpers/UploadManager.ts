import { isError } from "@/api/isError"
import { ApiError } from "@/types/server/ApiError"
import { RequestMethod } from "@/types/server/RequestMethod"

const mb5 = 5 * 1024 * 1024

export type UploadObject = { url: string, uploadSession: UploadSession, index: number }
export type UploadSession = { uploadId: string, key: string, file: File, description: string }
export type Chunk = { blob: Blob, url: string, bytes: number }
export type ChunkUploadResult = { response: Promise<Response>, chunk: Chunk }
export type FileUploadPart = { ETag: string, PartNumber: number }
export type FileUploadResult = { uploadId: string, key: string, fileName: string, totalParts: number, parts: FileUploadPart[] }
export type FileRecord = { file: File, description: string, projectId: string }
export type UploadingFileRecord = FileRecord & { chunks: number, uploadedChucks: number, started: boolean, finished: boolean }

class UploadManager {
    fileRecords: UploadingFileRecord[] = []
    uploadSessions: UploadSession[] = []
    stagingQueue: UploadObject[] = []
    uploadQueue: string[] = []
    finished: FileUploadResult[] = []

    errorEncountered = false
    isRunning = false
    isAddingToStaging = false
    isAddingToSessions = false
    maxConcurrentUploads = 30
    authAction: <T>(endpoint: string, method: RequestMethod, body?: string | FormData) => Promise<T | Partial<ApiError>>
    addUploaded: (uploaded: number) => void

    constructor(authAction: any, setTotalUploaded: any) {
        this.authAction = authAction
        this.addUploaded = setTotalUploaded
    }

    getFileChunks(file: File) {
        return Math.ceil(file.size / mb5)
    }

    getFileRecordsForUpload(fileRecords: FileRecord[]) {
        this.fileRecords = [
            ...this.fileRecords,
            ...fileRecords.map(file => ({
                ...file,
                chunks: this.getFileChunks(file.file),
                uploadedChucks: 0,
                started: false,
                finished: false,
            }))
        ]
    }

    async start(fileRecords: FileRecord[]) {
        this.getFileRecordsForUpload(fileRecords)
        console.log(fileRecords, this.fileRecords)
        this.isRunning = true
        await this.loop()
    }

    async update(fileRecords: FileRecord[]) {
        this.getFileRecordsForUpload(fileRecords)
        this.addUploaded(0)
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
        while (this.isRunning) {
            this.checkQueues()
            await new Promise(resolve => setTimeout(resolve, 10));
            if (this.errorEncountered) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.errorEncountered = false
            }
        }
    }

    async getPresignedUrls(uploadSession: UploadSession): Promise<UploadObject[]> {
        const response = await this.authAction<{ urls: string[] }>('storage-file/upload/presigned-parts', "POST", JSON.stringify({
            key: uploadSession.key,
            uploadId: uploadSession.uploadId,
            partCount: this.getFileChunks(uploadSession.file)
        }))
        if (isError(response)) throw new Error("Failed to get presigned urls")
        return response.urls.map((url, index) => ({ url, uploadSession, index }))
    }

    getUploadChunk(file: File, uploadUrl: string, index: number): Chunk {
        const start = index * mb5
        const end = Math.min(file.size, (index + 1) * mb5)
        return { blob: file.slice(start, end), url: uploadUrl, bytes: end - start }
    }

    checkQueues() {
        if (!this.isRunning || this.isAddingToSessions || this.isAddingToStaging) return
        const unUploadedFiles = this.fileRecords.filter(file => !file.started)

        if (!this.isAddingToSessions && this.uploadSessions.length == 0 && unUploadedFiles.length > 0 && this.stagingQueue.length == 0) {
            this.isAddingToSessions = true
            unUploadedFiles[0].started = true
            this.getUploadSession(unUploadedFiles[0]).then((nextSession: UploadSession) => {
                console.log(`Adding ${unUploadedFiles[0].file.name} to upload session`)
                this.uploadSessions.push(nextSession)
                this.isAddingToSessions = false
            }).catch(err => {
                console.log(`Recovering adding ${unUploadedFiles[0].file.name} to session following error`)
                console.error(err)
                this.isAddingToSessions = false
                unUploadedFiles[0].started = false
                this.errorEncountered = true
            })
        }

        if (!this.isAddingToStaging && this.stagingQueue.length < this.maxConcurrentUploads && this.uploadSessions.length > 0) {
            this.isAddingToStaging = true
            const uploadSession = this.uploadSessions.shift()!
            this.getPresignedUrls(uploadSession).then((uploadObjects: UploadObject[]) => {
                console.log(`Adding ${uploadObjects.length} presigned urls for ${uploadSession.file.name} to staging queue`)
                this.stagingQueue.push(...uploadObjects)
                this.isAddingToStaging = false
            }).catch(err => {
                this.uploadSessions.unshift()
                console.log(`Recovering upload session from ${uploadSession.file.name} following error`)
                console.error(err)
                this.isAddingToStaging = false
                this.errorEncountered = true
            })
        }

        if (this.uploadQueue.length < this.maxConcurrentUploads && this.stagingQueue.length > 0) {
            const uploadObj = this.stagingQueue.shift()!
            this.uploadQueue.push(uploadObj.url)
            const fileRecord = this.fileRecords.find(({ file }) => file.name == uploadObj.uploadSession.file.name)
            const chunk = this.getUploadChunk(uploadObj.uploadSession.file, uploadObj.url, uploadObj.index)
            fetch(chunk.url, { method: 'PUT', body: chunk.blob }).then((response: Response) => {
                this.handlePartUpload(uploadObj, response)
                this.uploadQueue = this.uploadQueue.filter(p => p !== uploadObj.url)
                if (fileRecord) {
                    fileRecord.uploadedChucks++
                    console.log(`Uploaded chunk ${fileRecord.uploadedChucks}/${fileRecord.chunks} for ${fileRecord.file.name} to S3`)
                    if (fileRecord.uploadedChucks == fileRecord.chunks) fileRecord.finished = true
                }

            }).catch(async () => {
                this.uploadQueue = this.uploadQueue.filter(p => p !== uploadObj.url)
                this.stagingQueue.unshift(uploadObj)
                console.log(`Recovering chunk ${fileRecord?.uploadedChucks} from ${fileRecord?.file.name} following error`)
                this.errorEncountered = true
            })
        }

        if (this.finished.length > 0 && this.finished[0].parts.length == this.finished[0].totalParts) {
            const fileRecord = this.fileRecords.find(({ file }) => file.name == this.finished[0].fileName)

            if (fileRecord && fileRecord?.uploadedChucks == fileRecord?.chunks) {
                const fileUploadResult = this.finished.shift()!
                this.authAction<{ success: true }>('storage-file/upload/complete', "POST", JSON.stringify(fileUploadResult)).then((result) => {
                    if (isError(result)) {
                        this.finished.unshift(fileUploadResult)
                        console.log(`Recovering file completion for ${this.finished[0].fileName} following error`)
                        console.error(result)
                        this.errorEncountered = true
                    } else {
                        this.addUploaded(0)
                    }
                })
            }
        }
    }

    async handlePartUpload(uploadObj: UploadObject, result: Response) {
        const fileName = uploadObj.uploadSession.file.name
        this.addUploaded(uploadObj.uploadSession.file.size / Math.ceil(uploadObj.uploadSession.file.size / mb5))
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
                totalParts: this.getFileChunks(uploadObj.uploadSession.file),
                parts: [{ ETag, PartNumber: uploadObj.index + 1 }]
            })
        }
    }
}

export default UploadManager