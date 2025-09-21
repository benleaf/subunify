import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"
import Stripe from "stripe"

export const startStoragePaymentSession = ({ authAction, setAlert }: ActionInput) => async (projectId: string, volume: number, promoCode?: string) => {
    const result = await authAction<Stripe.Checkout.Session>(
        `stripe/start-storage-session/${projectId}/${volume}/${promoCode}`,
        'GET',
    )

    if (isError(result)) {
        setAlert('Failed to start payment session.', 'error')
        console.error(result)
    } else {
        return result
    }
}