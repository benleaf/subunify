import GlassText from "@/components/glassmorphism/GlassText";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { isError } from "@/api/isError";

const Payment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const { authAction } = useAuth()

    const confirmPayment = async () => {
        const project = await authAction<{ projectId: string }>(
            `stripe/fulfill/${searchParams.get('paymentId')}`,
            'GET',
        )
        if (isError(project)) throw new Error("Failed to fulfill payment");

        navigate(`/dashboard?projectId=${project.projectId}`)
    }

    useEffect(() => {
        if (searchParams.get('paymentId')) confirmPayment()
    }, [searchParams])


    return <GlassText size={"big"}>Confirming Payment...</GlassText>
}

export default Payment