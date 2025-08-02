import { isError } from "@/api/isError"
import { validateEmail } from "@/helpers/ValidateEmail"
import { ActionInput } from "@/types/actions/ActionInput"
import { Bundle } from "@/types/Bundle"

export const createSharedBundle = ({ authAction, setAlert, user }: ActionInput) => async (recipients: string[], selectedBundle?: Bundle) => {
    const invalidRecipients = recipients.filter(recipient => !validateEmail(recipient)).length
    if (invalidRecipients > 0) {
        setAlert('Invalid email provided for a recipient', 'error')
        return
    }

    const newBundle = await authAction<Bundle>('bundle', 'POST', JSON.stringify({
        name: selectedBundle?.name,
        description: selectedBundle?.description,
        recipients: [
            ...(recipients.map(recipient => ({ email: recipient, isOwner: false }))),
            { email: user.email, isOwner: true }
        ]
    }))

    if (newBundle && !isError(newBundle)) {
        return newBundle
    } else {
        setAlert('Unable to create bundle', 'error')
    }
}