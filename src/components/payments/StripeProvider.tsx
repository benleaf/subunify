import Stripe from 'stripe';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { isError } from '@/api/isError';
import { useAuth } from '@/auth/AuthContext';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_CLIENT_SECRET, {});

const StripeProvider = () => {
    const [options, setOptions] = useState<Stripe.Checkout.Session>()
    const { authAction } = useAuth()

    useEffect(() => {
        const getSession = async () => {
            const result = await authAction<Stripe.Checkout.Session>(
                `stripe/start-session`,
                'GET',
            )
            if (!isError(result)) {
                setOptions(result)
            }
        }
        getSession()
    }, [])

    return options &&
        <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret: options.client_secret }}
        >
            <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
}

export default StripeProvider