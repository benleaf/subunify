import { Alert, Button, Divider, Stack } from "@mui/material";
import BaseModal from "@/components/modal/BaseModal";
import StripeProvider from "../payments/StripeProvider";
import GlassSpace from "../glassmorphism/GlassSpace";
import { useState } from "react";
import GlassText from "../glassmorphism/GlassText";
import FileUploadNebula from "../graphics/FileUploadNebula";
import { useSize } from "@/hooks/useSize";
import { TaggedFile } from "@/pages/FileUpload";
import { getNumericFileMonthlyCost, getNumericFileUploadCost, getFileSize, largestSizeForMinPayment } from "@/helpers/FileSize";

type Props = {
  state: 'open' | 'closed',
  onClose?: () => void,
  onComplete?: () => void,
  taggedFiles?: TaggedFile[]
}

const PaymentModal = ({ state, onClose, onComplete, taggedFiles }: Props) => {
  const { width } = useSize()
  const onPaymentCompleat = async () => {
    onClose && onClose()
    onComplete && onComplete()
  }

  const totalSize = taggedFiles?.length ? taggedFiles.map(fileRecord => fileRecord.file.size).reduce((acc, cur) => acc + cur) : 0
  const absoluteMonthlyCost = getNumericFileMonthlyCost(totalSize)
  const absoluteMonthlyCostAfterUpload = Math.max(0.6, absoluteMonthlyCost)
  const monthlyCost = `$${absoluteMonthlyCostAfterUpload.toFixed(2)}`
  const uploadFee = (Math.max(0.5, getNumericFileUploadCost(totalSize))).toFixed(2)

  const [step, setStep] = useState(0)
  return <BaseModal state={state} close={onClose}>
    <GlassSpace size="moderate">
      <Stack spacing={2}>
        {step == 0 && <>
          <GlassText size="huge">Unleash <b>Your</b> <i>Potential</i></GlassText>
          <GlassText size="moderate">Subscribe to SUBUNIFY and discover the power of the File Nebula</GlassText>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FileUploadNebula points={1000} width={Math.min(width, 500) * 0.5} />
          </div>
          <Button variant="contained" onClick={() => setStep(taggedFiles ? 1 : 2)}>Let's Go</Button>
        </>}
        {step == 1 && taggedFiles && <>
          <Stack >
            <GlassText size="huge"><b>Your</b> Subscription</GlassText>
            <GlassText size="moderate" color="white">Upload size: {getFileSize(totalSize)}</GlassText>
            <Divider style={{ margin: '0.4em' }} />
            <GlassText size="moderate" color="white">Subscription: {monthlyCost} per month</GlassText>
            <Divider style={{ margin: '0.4em' }} />
            <GlassText size="moderate" color="white">One time upload fee: ${uploadFee}</GlassText>
            {absoluteMonthlyCost < 0.6 && <Alert severity="success" style={{ margin: '0.4em' }}>
              You can upload upto {largestSizeForMinPayment} before your subscription will rise above $0.60 per month
            </Alert>}
          </Stack>
          <Button variant="contained" onClick={() => setStep(2)}>Subscribe</Button>
        </>}
        {step == 2 && <div style={{ maxHeight: '90vh', overflowY: 'scroll' }}>
          <StripeProvider onComplete={onPaymentCompleat} />
        </div>}
      </Stack>
    </GlassSpace>
  </BaseModal>
};

export default PaymentModal;
