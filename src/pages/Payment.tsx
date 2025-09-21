import GlassText from "@/components/glassmorphism/GlassText";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { isError } from "@/api/isError";

const Payment = () => {
    const [searchParams] = useSearchParams();
    const { authAction, setAlert, setUserAttributes } = useAuth()
    const navigate = useNavigate()

    const confirmPayment = async () => {
        const project = await authAction<{ projectId: string, stripeSubscriptionId: string }>(
            `stripe/fulfill/${searchParams.get('paymentId')!}`,
            'GET',
        )

        if (project && !isError(project)) {
            setUserAttributes({ stripeSubscriptionId: project.stripeSubscriptionId })
            navigate(`/dashboard?projectId=${project.projectId}`)
        } else {
            setAlert('Failed to fulfill payment session.', 'error')
        }
    }

    useEffect(() => {
        if (searchParams.get('paymentId')) confirmPayment()
    }, [searchParams])

    return <GlassText size={"big"}>Confirming Payment...</GlassText>
}

export default Payment