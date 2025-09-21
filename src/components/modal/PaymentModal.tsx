import BaseModal from "@/components/modal/BaseModal";
import GlassSpace from "../glassmorphism/GlassSpace";
import { useEffect, useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";
import { useAction } from "@/contexts/actions/infrastructure/ActionContext";

type Props = {
  state: boolean,
  onClose?: () => void,
  volume?: number
  projectId: string
  promoCode?: string
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_CLIENT_SECRET, {});

const PaymentModal = ({ state, onClose, projectId, volume = 1, promoCode }: Props) => {
  const [options, setOptions] = useState<Stripe.Checkout.Session>()
  const { startStoragePaymentSession } = useAction()

  useEffect(() => {
    const getSession = async () => {
      setOptions(undefined)
      if (!state) return
      const result = await startStoragePaymentSession(projectId, volume, promoCode)
      setOptions(result)
    }
    getSession()
  }, [state])

  return <BaseModal state={state} close={onClose}>
    <GlassSpace size="moderate">
      <div style={{ maxHeight: '90vh', overflowY: 'scroll' }}>
        {options && <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{
            clientSecret: options.client_secret,
          }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>}
      </div>
    </GlassSpace>
  </BaseModal>
};

export default PaymentModal;
