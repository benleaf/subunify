import { useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import BaseModal from "@/components/modal/BaseModal";
import GlassSpace from "@/components/glassmorphism/GlassSpace";

type Props = {
    overideState?: boolean
    onFinish: (result: 'success' | 'incompleate') => void
}

const PaymentModal = ({ overideState, onFinish }: Props) => {
    const [paymentModalOpen, setAuthModalOpen] = useState(false)

    useEffect(() => {
        if (overideState !== undefined) setAuthModalOpen(overideState)
    }, [overideState])

    const close = () => {
        setAuthModalOpen(false)
        onFinish('incompleate')
    }

    const compleate = () => {
        setAuthModalOpen(false)
        onFinish('success')
    }

    return <>
        <BaseModal state={paymentModalOpen ? 'open' : 'closed'} close={close}>
            <GlassSpace size="large">
                <Stack spacing={2}>
                    {/* <StripeProvider /> */}
                    <Button onClick={compleate}>Done</Button>
                </Stack>
            </GlassSpace>
        </BaseModal>
    </>
};

export default PaymentModal;
