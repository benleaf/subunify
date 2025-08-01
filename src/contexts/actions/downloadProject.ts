import { ActionInput } from "@/types/actions/ActionInput"
import { ProxySettingTypes } from "@/types/server/ProxySettingTypes"

export const downloadProject = ({ downloadAction, setAlert }: ActionInput) => async (type: ProxySettingTypes, projectId?: string, bytes?: number) => {
    if (!projectId) {
        setAlert('Unable to download, no project selected.', 'warning')
        return
    }
    if (!bytes) {
        setAlert('Could not find any project data to download.', 'warning')
        return
    }
    await downloadAction(`file-download/project-download/${projectId}/${type}`, bytes)
}