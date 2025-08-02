import { isError } from "@/api/isError"
import { CollaboratorRoles } from "@/constants/CollaboratorRoles"
import { ActionInput } from "@/types/actions/ActionInput"
import { Collaborator } from "@/types/Collaborator"

export const updateCollaborator = ({ authAction, setAlert, updateProperties }: ActionInput) => async (
    projectId?: string,
    collaboratorId?: string,
    newRole?: keyof typeof CollaboratorRoles
) => {
    if (!collaboratorId || !newRole || !projectId) return

    const result = await authAction<Collaborator[]>(`user-project/role`, 'PATCH', JSON.stringify({
        projectId: projectId,
        collaboratorId: collaboratorId,
        newRole,
    }))

    if (isError(result)) {
        setAlert('Unable to update collaborator role', 'error')
    } else {
        setAlert('Collaborator role was successfully updated', 'success')
        updateProperties({ collaborators: result })
    }
}