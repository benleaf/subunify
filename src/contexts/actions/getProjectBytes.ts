import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"
import { ProxySettingTypes } from "@/types/server/ProxySettingTypes"

export const getProjectBytes = ({ authAction, setAlert }: ActionInput) => async (projectId: string, type: ProxySettingTypes) => {
    const bundle = await authAction<number>(`file-download/project-bytes/${projectId}/${type}`, 'GET')
    if (isError(bundle)) {
        setAlert(bundle.message ?? 'Unable to get download info.', 'warning')
        return
    }
    return bundle
}