import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"
import { Project } from "@/types/server/ProjectResult"

export const createProject = ({ authAction, updateProperties, setAlert }: ActionInput) => async (project: Partial<Project>) => {
    const newProject = await authAction<Project>('project', 'POST', JSON.stringify(project))
    if (!isError(newProject) && newProject) {
        updateProperties({
            page: 'project',
            selectedProjectId: newProject.id,
        })
        setAlert('Project successfully created', 'success')
    }
}