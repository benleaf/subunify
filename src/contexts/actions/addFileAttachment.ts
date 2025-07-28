import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"
import { FileAttachment } from "@/types/server/FileAttachment"

export const addFileAttachment = ({ authAction, loadProject }: ActionInput) => async (fileId: string, attachedFileId: string) => {
    const fileAttachment = await authAction<FileAttachment>(`file-attachment`, 'POST', JSON.stringify({
        fileId,
        attachedFileId
    }))

    if (!isError(fileAttachment)) {
        await loadProject()
        return fileAttachment
    }
}