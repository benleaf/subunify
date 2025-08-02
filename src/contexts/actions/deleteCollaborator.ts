import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"
import { Collaborator } from "@/types/Collaborator"

export const deleteCollaborator = ({ authAction, setAlert, updateProperties }: ActionInput) => async (projectId?: string, collaboratorId?: string) => {
    if (!projectId) {
        setAlert('Unable to delete collaborator, no project is selected.', 'warning')
        return
    }
    if (!collaboratorId) {
        setAlert('Could not delete collaborator, no collaborator was selected.', 'warning')
        return
    }

    const result = await authAction<Collaborator[]>(`user-project/${projectId}/${collaboratorId}`, 'DELETE')
    if (isError(result)) {
        setAlert('Unable to remove collaborator from project', 'error')
        return false
    } else {
        setAlert('Collaborator successfully removed from project', 'success')
        updateProperties({ collaborators: result })
        return true
    }
}