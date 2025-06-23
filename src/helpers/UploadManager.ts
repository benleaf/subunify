import { isError } from "@/api/isError"
import { ApiError } from "@/types/server/ApiError"
import { RequestMethod } from "@/types/server/RequestMethod"

const mb5 = 5 * 1024 * 1024

export type UploadObject = { url: string, uploadSession: UploadSession, index: number, size: number }
export type UploadSession = { uploadId: string, key: string, file: File, description: string }
export type Chunk = { blob: Blob, url: string, bytes: number }
export type ChunkUploadResult = { response: Promise<Response>, chunk: Chunk }
export type FileUploadPart = { ETag: string, PartNumber: number }
export type FileUploadResult = { uploadId: string, key: string, fileName: string, totalParts: number, parts: FileUploadPart[] }
export type FileRecord = { file: File, description: string, projectId: string }
export type UploadingFileRecord = FileRecord & { chunks: number, uploadedChucks: number, started: boolean, finished: boolean }

class UploadManager {
    public fileRecords: UploadingFileRecord[] = []
    public isRunning = false

    private uploadSessions: UploadSession[] = []
    private stagingQueue: UploadObject[] = []
    private uploadQueue: string[] = []
    private finished: FileUploadResult[] = []
    private errorEncountered = false
    private isAddingToStaging = false
    private isAddingToSessions = false
    private maxConcurrentUploads = 1
    private authAction?: <T>(endpoint: string, method: RequestMethod, body?: string | FormData) => Promise<T | Partial<ApiError>>
    private addUploaded?: (uploaded: number) => void
    private updateDataStored?: (projectId: string, change: number) => void

    public addCallbacks(callbacks: { authAction?: any, addUploaded?: any, updateDataStored?: any }) {
        if (callbacks.authAction) this.authAction = callbacks.authAction
        if (callbacks.addUploaded) this.addUploaded = callbacks.addUploaded
        if (callbacks.updateDataStored) this.updateDataStored = callbacks.updateDataStored
    }

    private getFileChunks(file: File) {
        return Math.ceil(file.size / mb5)
    }

    private getFileRecordsForUpload(fileRecords: FileRecord[]) {
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

    public async start(fileRecords: FileRecord[]) {
        this.getFileRecordsForUpload(fileRecords)
        this.isRunning = true
        await this.loop()
    }

    public async update(fileRecords: FileRecord[]) {
        if (!this.authAction) return
        if (this.isRunning) {
            this.getFileRecordsForUpload(fileRecords)
        } else {
            this.start(fileRecords)
        }
    }

    public async setConcurrentUploads(concurrentUploads: number) {
        this.maxConcurrentUploads = (concurrentUploads ** 1.5) + 1
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

    public async cancel() {
        this.isRunning = false
        this.uploadSessions = []
        this.stagingQueue = []
        this.uploadQueue = []
        this.finished = []
        this.fileRecords = []
    }

    private async getUploadSession(unUploadedFiles: UploadingFileRecord) {
        const getSession = await this.authAction!<UploadSession>(
            'storage-file/upload/start',
            "POST",
            JSON.stringify({
                projectId: unUploadedFiles.projectId,
                fileLastModified: new Date(unUploadedFiles.file.lastModified),
                name: unUploadedFiles.file.name,
                size: unUploadedFiles.file.size,
                description: unUploadedFiles.description
            })
        )

        if (isError(getSession)) {
            console.error(getSession)
            this.isAddingToSessions = false
            unUploadedFiles.started = false
            this.errorEncountered = true
        } else {
            this.uploadSessions.push({
                ...getSession,
                description: unUploadedFiles.description,
                file: unUploadedFiles.file
            })
            this.isAddingToSessions = false
        }
    }

    private async getPresignedUrls(uploadSession: UploadSession) {
        const chunks = this.getFileChunks(uploadSession.file)
        const response = await this.authAction!<{ urls: string[] }>('storage-file/upload/presigned-parts', "POST", JSON.stringify({
            key: uploadSession.key,
            uploadId: uploadSession.uploadId,
            partCount: chunks
        }))

        if (isError(response)) {
            this.uploadSessions.unshift()
            console.error(response)
            this.isAddingToStaging = false
            this.errorEncountered = true
        } else {
            const uploadObjects = response.urls.map((url, index) => ({
                url,
                uploadSession,
                index,
                size: index == chunks - 1 ? uploadSession.file.size - (index * mb5) : mb5
            }))
            this.stagingQueue.push(...uploadObjects)
            this.isAddingToStaging = false
        }

    }

    private tryEndUpload() {
        console.log('end', this.uploadSessions.length, this.stagingQueue.length, this.uploadQueue.length, this.finished.length)
        const isEverythingEmpty = !this.uploadSessions.length &&
            !this.stagingQueue.length &&
            !this.uploadQueue.length &&
            !this.finished.length

        if (isEverythingEmpty) {
            this.cancel()
            this.addUploaded && this.addUploaded(1)
        }
    }

    private async uploadComplete(fileUploadResult: FileUploadResult, fileRecord: UploadingFileRecord) {
        this.authAction!<{ success: true }>('storage-file/upload/complete', "POST", JSON.stringify(fileUploadResult)).then((result) => {
            if (isError(result)) {
                this.finished.unshift(fileUploadResult)
                console.error(result)
                this.errorEncountered = true
            } else {
                console.log('finished', fileRecord.file.name)
                this.updateDataStored && this.updateDataStored(fileRecord.projectId, fileRecord.file.size)
                this.tryEndUpload()
            }
        })
    }

    private async uploadChunk(chunk: Chunk, uploadObj: UploadObject, fileRecord?: UploadingFileRecord) {
        fetch(chunk.url, { method: 'PUT', body: chunk.blob }).then((response: Response) => {
            this.handlePartUpload(uploadObj, response)
            this.uploadQueue = this.uploadQueue.filter(p => p !== uploadObj.url)
            if (fileRecord) {
                fileRecord.uploadedChucks++
                if (fileRecord.uploadedChucks >= fileRecord.chunks) fileRecord.finished = true
            }

        }).catch(async () => {
            this.uploadQueue = this.uploadQueue.filter(p => p !== uploadObj.url)
            this.stagingQueue.unshift(uploadObj)
            this.errorEncountered = true
        })
    }

    private getUploadChunk(file: File, uploadUrl: string, index: number): Chunk {
        const start = index * mb5
        const end = Math.min(file.size, (index + 1) * mb5)
        return { blob: file.slice(start, end), url: uploadUrl, bytes: end - start }
    }

    private checkQueues() {
        if (!this.isRunning || this.isAddingToSessions || this.isAddingToStaging) return
        const unUploadedFiles = this.fileRecords.filter(file => !file.started)

        if (!this.isAddingToSessions && this.uploadSessions.length == 0 && unUploadedFiles.length > 0 && this.stagingQueue.length == 0) {
            this.isAddingToSessions = true
            unUploadedFiles[0].started = true
            this.getUploadSession(unUploadedFiles[0])
        }

        if (!this.isAddingToStaging && this.stagingQueue.length < this.maxConcurrentUploads && this.uploadSessions.length > 0) {
            this.isAddingToStaging = true
            const uploadSession = this.uploadSessions.shift()!
            this.getPresignedUrls(uploadSession)
        }

        while (this.uploadQueue.length < this.maxConcurrentUploads && this.stagingQueue.length > 0) {
            const uploadObj = this.stagingQueue.shift()!
            this.uploadQueue.push(uploadObj.url)
            const fileRecord = this.fileRecords.find(({ file }) => file.name == uploadObj.uploadSession.file.name)
            const chunk = this.getUploadChunk(uploadObj.uploadSession.file, uploadObj.url, uploadObj.index)
            this.uploadChunk(chunk, uploadObj, fileRecord)
        }

        if (this.finished.length > 0 && this.finished[0].parts.length >= this.finished[0].totalParts) {
            const fileRecord = this.fileRecords.find(({ file }) => file.name == this.finished[0].fileName)

            if (fileRecord && fileRecord?.uploadedChucks == fileRecord?.chunks) {
                const fileUploadResult = this.finished.shift()!
                this.uploadComplete(fileUploadResult, fileRecord)
            }
        }
    }

    private handlePartUpload(uploadObj: UploadObject, result: Response) {
        const fileName = uploadObj.uploadSession.file.name
        this.addUploaded && this.addUploaded(uploadObj.size)
        const ETag = result.headers.get('ETag')!
        const existing = this.finished.find(f => f.fileName === fileName)
        console.log(existing, this.stagingQueue.length, this.uploadQueue.length, this.finished.length)

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