import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"

export const fulfillPaymentSession = ({ authAction, setAlert }: ActionInput) => async (paymentId: string) => {
    const project = await authAction<{ projectId: string }>(
        `stripe/fulfill/${paymentId}`,
        'GET',
    )

    if (isError(project)) {
        setAlert('Failed to fulfill payment session.', 'error')
    } else {
        return project
    }
}