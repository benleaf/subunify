import StripeProvider from "@/components/payments/StripeProvider";
import GlassSpace from "../../glassmorphism/GlassSpace";
import GlassText from "../../glassmorphism/GlassText";

const Payment = () => {
    return <>
        <GlassText size='massive' style={{}}>
            <b>Power</b> to the Artist
        </GlassText>
        <GlassText size='large' style={{}}>
            Let's get you an Payment
        </GlassText>
        <GlassSpace size='small' />
        <StripeProvider onComplete={console.log} />
    </>
}

export default Payment