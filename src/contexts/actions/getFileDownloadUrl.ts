import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"
import { ApiError } from "@/types/server/ApiError"
import { StoredFile } from "@/types/server/ProjectResult"
import { ProxySettingTypes } from "@/types/server/ProxySettingTypes"

export const getFileDownloadUrl = ({ authAction, setAlert }: ActionInput) => async (file: StoredFile, proxyType?: ProxySettingTypes) => {
    const proxy = file.proxyFiles.find(proxy => proxy.proxyType == proxyType)
    let response: { url: string } | Partial<ApiError>

    if (proxy) {
        response = await authAction<{ url: string }>(`proxy-file/${proxy.id}/${proxy.proxyType}`, 'GET')
    } else {
        response = await authAction<{ url: string }>(`file-download/${file.id}`, 'GET')
    }

    if (!response || isError(response)) {
        setAlert(`Unable to get file url for ${file.name}`, 'error')
    }

    return response
}