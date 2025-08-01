import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"
import { ProjectSettings } from "@/types/server/ProjectResult"

type Settings = Omit<ProjectSettings, 'VIDEO_THUMBNAIL'>

export const setProjectSettings = ({ authAction, setAlert }: ActionInput) => async (
    projectId: string,
    settings: Omit<Settings, 'RAW' | 'IMAGE_THUMBNAIL'>
) => {
    const result = await authAction<Settings>(`project-setting`, 'POST', JSON.stringify({
        projectId: projectId,
        settings
    }))

    if (!isError(result)) setAlert('Successfully updates settings!', 'success')
}