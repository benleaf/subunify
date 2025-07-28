import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"

export const removeFileAttachment = ({ authAction, loadProject }: ActionInput) => async (attachmentId: string) => {
    const deleteResult = await authAction<TODO>(`file-attachment/${attachmentId}`, 'DELETE')
    if (!isError(deleteResult)) {
        await loadProject()
    }
}