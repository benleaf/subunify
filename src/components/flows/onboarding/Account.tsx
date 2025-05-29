import GlassSpace from "../../glassmorphism/GlassSpace";
import GlassText from "../../glassmorphism/GlassText";
import AuthArea from "@/auth/AuthArea";

const Account = () => {
    return <>
        <GlassText size='massive' style={{}}>
            <b>Power</b> to the Artist
        </GlassText>
        <GlassText size='large' style={{}}>
            Let's get you an account
        </GlassText>
        <GlassSpace size='small' />
        <AuthArea />
    </>
}

export default Account