import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"
import { ProjectResult } from "@/types/server/ProjectResult"

export const wipeProject = ({ authAction, updateProperties, setAlert, setLoading }: ActionInput) => async (projectId: string) => {
    setLoading(true)
    const project = await authAction<ProjectResult>(`stripe/project/${projectId}`, 'DELETE')
    setLoading(false)
    if (!isError(project)) {
        updateProperties({ selectedProject: project })
        setAlert('Project wiped successfully', 'success')
        return project
    }
}