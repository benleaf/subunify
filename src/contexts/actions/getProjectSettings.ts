import { isError } from "@/api/isError"
import { VideoCodecs } from "@/constants/VideoCodecs"
import { ActionInput } from "@/types/actions/ActionInput"
import { ProxySettingTypes } from "@/types/server/ProxySettingTypes"

type SettingsResult = { id: string, setting: ProxySettingTypes, value: keyof typeof VideoCodecs }

export const getProjectSettings = ({ authAction, setAlert }: ActionInput) => async (projectId: string) => {
    const result = await authAction<SettingsResult[]>(`project-setting/${projectId}`, 'GET')

    if (isError(result)) {
        setAlert('Unable to get project settings', 'error')
        return []
    }

    return result
}