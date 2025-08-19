import { isError } from "@/api/isError"
import { PreviewProxySettings } from "@/constants/PreviewProxySettings"
import { ActionInput } from "@/types/actions/ActionInput"
import { StoredFile } from "@/types/server/ProjectResult"
import { ProxySettingTypes } from "@/types/server/ProxySettingTypes"

export const getFileDownloadUrl = ({ authAction, setAlert }: ActionInput) => async (file: StoredFile, proxyType?: ProxySettingTypes) => {
    const isArchived = file.location == 'DEEP' && !(proxyType && PreviewProxySettings.includes(proxyType))
    if (isArchived) {
        setAlert(`File Archived, please notify owner`, 'info')
        return
    }

    const proxy = file.proxyFiles.find(proxy => proxy.proxyType == proxyType)
    const response = await authAction<{ url: string }>(`file-download/${file.id}/${proxy?.proxyType ?? 'RAW'}`, 'GET')

    if (!response || isError(response)) {
        setAlert(`Unable to get file url for ${file.name}`, 'error')
    }

    return response
}