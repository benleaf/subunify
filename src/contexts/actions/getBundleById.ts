import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"
import { Bundle } from "@/types/Bundle"

export const getBundleById = ({ authAction }: ActionInput) => async (bundleId: string) => {
    const bundle = await authAction<Bundle>(`bundle/${bundleId}`, 'GET')
    if (!isError(bundle)) {
        return bundle
    }
}