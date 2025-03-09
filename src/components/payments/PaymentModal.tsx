import { Stack } from "@mui/material";
import BaseModal from "@/components/modal/BaseModal";
import StripeProvider from "./StripeProvider";
import GlassSpace from "../glassmorphism/GlassSpace";

type Props = {
    state: 'open' | 'closed',
    onClose?: () => void
}

const PaymentModal = ({ state, onClose }: Props) => {
    return <BaseModal state={state} close={onClose}>
        <GlassSpace size="moderate" style={{ maxHeight: '80vh', overflowY: 'scroll', }}>
            <Stack spacing={2}>
                <StripeProvider />
            </Stack>
        </GlassSpace>
    </BaseModal>
};

export default PaymentModal;
