import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"

export const respondToProjectInvite = ({ updateProperties, authAction, properties }: ActionInput) => async (projectId: string, response: boolean) => {
    const projectResult = await authAction<void>(`user/respond-to-project-invite`, 'POST', JSON.stringify({ projectId, response }))
    if (!isError(projectResult)) {
        if (response) {
            updateProperties({
                projects: properties.projects?.map(
                    project => project.id == projectId ? { ...project, inviteAccepted: response } : project
                )
            })
        } else {
            updateProperties({ projects: properties.projects?.filter(project => project.id != projectId) })
        }
    }
}