import { Button, Stack, Step, StepButton, Stepper } from "@mui/material";
import BaseModal from "@/components/modal/BaseModal";
import StripeProvider from "../payments/StripeProvider";
import GlassSpace from "../glassmorphism/GlassSpace";
import { useContext, useState } from "react";
import GlassText from "../glassmorphism/GlassText";
import { StateMachineDispatch } from "@/App";

type Props = {
  state: 'open' | 'closed',
  onClose?: () => void,
  onComplete?: () => void,
}

const PaymentModal = ({ state, onClose, onComplete }: Props) => {
  const onPaymentCompleat = async () => {
    onClose && onClose()
    onComplete && onComplete()
  }

  const [step, setStep] = useState(0)
  return <BaseModal state={state} close={onClose}>
    <GlassSpace size="small">
      <Stepper nonLinear activeStep={step}>
        <Step completed={step == 0}>
          <StepButton color="inherit">
            Payments Overview
          </StepButton>
        </Step>
        <Step completed={step == 1}>
          <StepButton color="inherit">
            Payment Form
          </StepButton>
        </Step>
      </Stepper>
    </GlassSpace>
    <GlassSpace size="moderate" style={{ maxHeight: '80vh', overflowY: 'scroll', }}>
      <Stack spacing={2}>
        {step == 0 && <>
          <GlassText size="large">Payments Overview</GlassText>
          <GlassText size="moderate">To use SUBUNIFY you will need an active subscription</GlassText>
          <GlassText size="small">
            Payments are handled through the secure payment system Stripe.
            Once you have entered your details, the payment will be processed and you will receive a confirmation email once the payment is complete.
            If you have any files pending upload, the upload process will start automatically following payment confirmation.
          </GlassText>
        </>}
        {step == 1 && <StripeProvider onComplete={onPaymentCompleat} />}
      </Stack>
    </GlassSpace>
    {!step && <Button onClick={() => setStep(1)}>Next</Button>}
  </BaseModal>
};

export default PaymentModal;
