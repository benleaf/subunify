import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"
import { StoredFile } from "@/types/server/ProjectResult"
import { ProxySettingTypes } from "@/types/server/ProxySettingTypes"

export const getFileProxyDownloadUrl = ({ authAction }: ActionInput) => async (file: StoredFile | undefined, proxyType: ProxySettingTypes) => {
    const thumbnail = file?.proxyFiles.find(proxy => proxy.proxyType == proxyType)
    if (!file || !thumbnail) return

    const response = await authAction<{ url: string }>(`proxy-file/${thumbnail.id}/${thumbnail.proxyType}`, 'GET')
    if (response && !isError(response)) {
        return response
    }
}