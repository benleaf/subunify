import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"
import { AddCollaboratorSettings } from "@/types/AddCollaboratorSettings"

export const addProjectCollaborator = ({ authAction, setAlert }: ActionInput) => async (settings: AddCollaboratorSettings) => {
    const result = authAction<Partial<void>>(`project/add-collaborator`, 'POST', JSON.stringify(settings))

    if (isError(result)) {
        setAlert('Failed to send invitation', 'error')
        console.error(result)
    } else {
        setAlert(`Invitation sent to ${settings.email}`, 'success')
    }
}