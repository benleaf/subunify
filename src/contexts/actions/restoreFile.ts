import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"
import { ApiError } from "@/types/server/ApiError"
import { StoredFile } from "@/types/server/ProjectResult"
import { ProxySettingTypes } from "@/types/server/ProxySettingTypes"

export const restoreFile = ({ authAction, updateProperties, properties, setAlert }: ActionInput) => async (file: StoredFile, proxyType?: ProxySettingTypes) => {
    const proxy = file.proxyFiles.find(proxy => proxy.proxyType == proxyType)
    let response: StoredFile | Partial<ApiError>

    if (proxy) {
        response = await authAction<StoredFile>(`proxy-file/request-restore/${proxy.id}`, 'POST')
    } else {
        response = await authAction<StoredFile>(`storage-file/request-restore/${file.id}`, 'POST')
    }

    if (response && !isError(response)) {
        if (properties.selectedProject) {
            const newFiles = properties.selectedProject.files.map(f => f.id === file.id ? response : f)
            updateProperties({ selectedProject: { ...properties.selectedProject, files: newFiles } })
        }
        setAlert('File restoration started', "success")
        return response
    }

    setAlert('Unable to restore file', 'error')
}