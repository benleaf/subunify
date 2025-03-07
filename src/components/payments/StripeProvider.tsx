import { apiAction } from '@/api/apiAction';
import Stripe from 'stripe';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { isError } from '@/api/getResource';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51Qy1iAG7dOhz5UJq3L5xDGv4kSOGZKzfslhORCYjS0Mga9lL19Rwjq3pvhPHCmLURNOrcvalwHqxi6romVW4YQIE00yXarToTw', {});

const StripeProvider = () => {
    const [options, setOptions] = useState<Stripe.Checkout.Session>()

    useEffect(() => {
        const getSession = async () => {
            const result = await apiAction<Stripe.Checkout.Session>(
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