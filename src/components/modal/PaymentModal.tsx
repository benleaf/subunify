import BaseModal from "@/components/modal/BaseModal";
import GlassSpace from "../glassmorphism/GlassSpace";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";
import { isError } from "@/api/isError";

type Props = {
  state: boolean,
  onClose?: () => void,
  volume?: number
  projectId: string
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_CLIENT_SECRET, {});

const PaymentModal = ({ state, onClose, projectId, volume = 1 }: Props) => {
  const [options, setOptions] = useState<Stripe.Checkout.Session>()
  const { authAction } = useAuth()

  useEffect(() => {
    const getSession = async () => {
      if (!state) return
      const result = await authAction<Stripe.Checkout.Session>(
        `stripe/start-storage-session/${projectId}/${volume}`,
        'GET',
      )
      if (!isError(result)) {
        setOptions(result)
      }
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
