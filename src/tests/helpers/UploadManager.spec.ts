import UploadManager, { FileRecord } from "@/helpers/UploadManager";
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

const mb5 = 5 * 1024 * 1024

const getFileChunks = (file: File) => {
    return Math.ceil(file.size / mb5)
}

describe('getMediaConvertConfig unit', () => {
    it('Successfully upload multiple files without any issues', async () => {
        const uploadManager = new UploadManager()
        let uploaded = 0
        let dataStored = 0
        let triggerFail = false

        const mockAuthAction = (endpoint: string, method: string, body: string) => {
            const parsed = JSON.parse(body)

            if (triggerFail) {
                return { message: `Failed to call: ${endpoint}` }
            }

            if (endpoint === 'storage-file/upload/start') {
                return { uploadId: `created-file-id_${parsed.name}`, key: 'key' }
            }
            if (endpoint === 'storage-file/upload/presigned-parts') {
                return { urls: [`${parsed.uploadId}.com`] }
            }
            if (endpoint === 'storage-file/upload/complete') {
                return { success: true }
            }
        }

        uploadManager.addCallbacks({
            authAction: mockAuthAction,
            addUploaded: (value: number) => uploaded += value,
            updateDataStored: (projectId: string, value: number) => dataStored += value,
        })

        const blob = new Blob(['file content'], { type: 'text/plain' })

        const mockFile1 = {
            ...blob,
            size: blob.size,
            slice: 'file content'.slice,
            name: 'mock-document.mp4',
            lastModified: Date.now()
        } as any as File

        const mockFile2 = {
            ...blob,
            size: blob.size,
            slice: 'file content'.slice,
            name: 'mock-movie.mov',
            lastModified: Date.now()
        } as any as File

        const fileRecords: FileRecord[] = [
            {
                description: 'test',
                projectId: 'projectId',
                file: mockFile1
            },
            {
                description: 'test',
                projectId: 'projectId',
                file: mockFile2
            },
        ]

        uploadManager.fileRecords = fileRecords.map(file => ({
            ...file,
            chunks: getFileChunks(file.file),
            uploadedChucks: 0,
            started: false,
            finished: false,
        }))
        // fetchMock.mockRejectOnce(new Error('Network failure'))
        // fetchMock.mockResponseOnce('', { status: 200, headers: { ETag: "mock-etag-123", }, });

        // The first attempt at getting an upload session fails
        uploadManager.isRunning = true
        triggerFail = true
        uploadManager.checkQueues()
        await Promise.resolve(setTimeout(() => { }, 100))
        expect(uploadManager.fileRecords.length).toBe(2)
        expect(uploadManager.uploadSessions.length).toBe(0)

        // The second attempt to upload it succeeds and the result is added to the upload sessions queue
        triggerFail = false
        uploadManager.checkQueues()
        await Promise.resolve(setTimeout(() => { }, 100))
        expect(uploadManager.fileRecords.length).toBe(2)
        expect(uploadManager.uploadSessions.length).toBe(1)
        expect(uploadManager.uploadSessions[0].uploadId).toBe('created-file-id_mock-document.mp4')

        // The first attempt at getting a presigned url fails, the state resets to exactly what it was.
        triggerFail = true
        uploadManager.checkQueues()
        await Promise.resolve(setTimeout(() => { }, 100))
        expect(uploadManager.fileRecords.length).toBe(2)
        expect(uploadManager.uploadSessions.length).toBe(1)
        expect(uploadManager.uploadSessions[0].uploadId).toBe('created-file-id_mock-document.mp4')

        // The second attempt succeeds and a url is added to the staging queue
        triggerFail = false
        uploadManager.checkQueues()
        await Promise.resolve(setTimeout(() => { }, 100))
        expect(uploadManager.stagingQueue.length).toBe(1)
        expect(uploadManager.stagingQueue[0].url).toBe('created-file-id_mock-document.mp4.com')
        expect(uploadManager.stagingQueue[0].index).toBe(0)
        expect(uploadManager.stagingQueue[0].size).toBe(12)

        // The failed chunk is moved back onto the staging queue (2x checks needed due to fetch mock strangeness)        
        fetchMock.mockRejectOnce(new Error('Network failure'))
        uploadManager.checkQueues()
        await Promise.resolve(setTimeout(() => { }, 100))
        uploadManager.checkQueues()
        await Promise.resolve(setTimeout(() => { }, 100))
        expect(uploadManager.stagingQueue.length).toBe(1)
        expect(uploadManager.stagingQueue[0].url).toBe('created-file-id_mock-document.mp4.com')
        expect(uploadManager.stagingQueue[0].index).toBe(0)
        expect(uploadManager.stagingQueue[0].size).toBe(12)

        // The chunk is uploaded and a record is added to the finished queue
        fetchMock.mockResponseOnce('', { status: 200, headers: { ETag: "mock-etag-123" } })
        uploadManager.checkQueues()
        await Promise.resolve(setTimeout(() => { }, 100))
        expect(uploadManager.finished.length).toBe(1)
        expect(uploadManager.finished[0].uploadId).toBe('created-file-id_mock-document.mp4')
        expect(uploadManager.finished[0].fileName).toBe('mock-document.mp4')
        expect(uploadManager.finished[0].key).toBe('key')
        expect(uploadManager.finished[0].parts.length).toBe(1)

        // Now there are no active uploads the next file is added to the queue.
        // The finish call fails and the finished file remains in the queue
        triggerFail = true
        uploadManager.checkQueues()
        await Promise.resolve(setTimeout(() => { }, 100))
        expect(uploadManager.uploadSessions.length).toBe(1)
        expect(uploadManager.finished.length).toBe(1)
        expect(uploadManager.uploadSessions[0].uploadId).toBe('created-file-id_mock-movie.mov')

        // The finish call succeeds and the finished file is removed
        // The new file is moved to the staging queue
        triggerFail = false
        uploadManager.checkQueues()
        await Promise.resolve(setTimeout(() => { }, 100))
        expect(uploadManager.stagingQueue.length).toBe(1)
        expect(uploadManager.stagingQueue[0].url).toBe('created-file-id_mock-movie.mov.com')
        expect(uploadManager.stagingQueue[0].index).toBe(0)
        expect(uploadManager.stagingQueue[0].size).toBe(12)

        // We fail a ton of times, due to the mock of fetch, we need to do a double resolve
        triggerFail = true
        fetchMock.mockRejectOnce(new Error('Network failure'))
        uploadManager.checkQueues()
        await Promise.resolve(setTimeout(() => { }, 100))
        uploadManager.checkQueues()
        await Promise.resolve(setTimeout(() => { }, 100))

        fetchMock.mockRejectOnce(new Error('Network failure'))
        uploadManager.checkQueues()
        await Promise.resolve(setTimeout(() => { }, 100))
        uploadManager.checkQueues()
        await Promise.resolve(setTimeout(() => { }, 100))

        fetchMock.mockRejectOnce(new Error('Network failure'))
        uploadManager.checkQueues()
        await Promise.resolve(setTimeout(() => { }, 100))
        uploadManager.checkQueues()
        await Promise.resolve(setTimeout(() => { }, 100))

        triggerFail = false
        fetchMock.mockResponse('', { status: 200, headers: { ETag: "mock-etag-123" } })
        uploadManager.checkQueues()
        await Promise.resolve(setTimeout(() => { }, 100))
        expect(uploadManager.finished[0].uploadId).toBe('created-file-id_mock-movie.mov')
        expect(uploadManager.finished[0].fileName).toBe('mock-movie.mov')
        expect(uploadManager.finished[0].key).toBe('key')
        expect(uploadManager.finished[0].parts.length).toBe(1)

        uploadManager.checkQueues()
        await Promise.resolve(setTimeout(() => { }, 100))

        expect(uploadManager.fileRecords.length).toBe(0)
        expect(uploadManager.uploadSessions.length).toBe(0)
        expect(uploadManager.stagingQueue.length).toBe(0)
        expect(uploadManager.finished.length).toBe(0)
        expect(uploaded).toBe(25)
        expect(dataStored).toBe(24)
    });
});