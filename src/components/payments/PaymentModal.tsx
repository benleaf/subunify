import { Stack } from "@mui/material";
import BaseModal from "@/components/modal/BaseModal";
import StripeProvider from "./StripeProvider";

type Props = {
    state: 'open' | 'closed',
    onClose: () => void
}

const PaymentModal = ({ state, onClose }: Props) => {
    return <BaseModal state={state} close={onClose}>
        <div style={{
            maxHeight: '90vh',
            overflow: 'scroll',
        }}>
            <Stack spacing={2}>
                <StripeProvider />
            </Stack>
        </div>
    </BaseModal>
};

export default PaymentModal;
