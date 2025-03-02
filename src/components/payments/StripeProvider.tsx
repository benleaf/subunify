import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeForm from './StripeForm';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51Qy1iAG7dOhz5UJq3L5xDGv4kSOGZKzfslhORCYjS0Mga9lL19Rwjq3pvhPHCmLURNOrcvalwHqxi6romVW4YQIE00yXarToTw');

const StripeProvider = () => {
    const options = {
        // passing the client secret obtained from the server
        clientSecret: '{{CLIENT_SECRET}}',
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <StripeForm />
        </Elements>
    );
}

export default StripeProvider