import GlassText from "@/components/glassmorphism/GlassText";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect } from "react";
import { useAction } from "@/contexts/actions/infrastructure/ActionContext";

const Payment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const { fulfillPaymentSession } = useAction()

    const confirmPayment = async () => {
        const project = await fulfillPaymentSession(searchParams.get('paymentId')!)
        if (project)
            navigate(`/dashboard?projectId=${project.projectId}`)
    }

    useEffect(() => {
        if (searchParams.get('paymentId')) confirmPayment()
    }, [searchParams])


    return <GlassText size={"big"}>Confirming Payment...</GlassText>
}

export default Payment