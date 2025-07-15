import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"
import { PaymentResult } from "@/types/server/PaymentResult"

export const getUserPayments = ({ authAction }: ActionInput) => async () => {
    const bundle = await authAction<PaymentResult[]>(`payment`, 'GET')
    if (!isError(bundle)) {
        return bundle
    }
}