import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"

export const getPromoCodePrice = ({ authAction }: ActionInput) => async (code: string) => {
    const price = await authAction<number>(`stripe/promo-code-discount/${code}`, 'GET')
    if (!isError(price)) {
        return price
    }
}