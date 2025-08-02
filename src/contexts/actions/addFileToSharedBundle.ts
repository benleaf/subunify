import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"
import { Bundle } from "@/types/Bundle"
import { ProxySettingTypes } from "@/types/server/ProxySettingTypes"

export const addFileToSharedBundle = ({ authAction, setAlert }: ActionInput) => async (
    fileId: string,
    downloadType: ProxySettingTypes,
    message?: string,
    bundle?: Bundle,
) => {
    if (!bundle?.id) return false

    const updatedBundle = await authAction<Bundle[]>('bundle/file', 'POST', JSON.stringify({
        bundleId: bundle.id,
        fileId: fileId,
        message,
        downloadProxyType: downloadType
    }))

    if (!isError(updatedBundle)) {
        setAlert('Successfully added file to share bundle.', 'success')
        return true
    } else {
        setAlert('Unable to add file to share bundle', 'error')
        return false
    }
}