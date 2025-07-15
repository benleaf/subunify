import { CssSizes } from "@/constants/CssSizes";
import GlassSpace from "../../glassmorphism/GlassSpace";
import GlassText from "../../glassmorphism/GlassText";
import AuthArea from "@/auth/AuthArea";

const Account = () => {
    return <>
        <GlassText size='massive' style={{ lineHeight: CssSizes.moderate }}>
            <b>Empowered.</b>
        </GlassText>
        <GlassText size='moderate'>
            Freed from constraint. Free to create.
        </GlassText>
        <GlassSpace size="tiny" />
        <GlassText size='large' style={{}}>
            Join a <b>community</b> of creators and teams who are empowered to create and share without limits.
        </GlassText>
        <GlassSpace size='small' />
        <AuthArea />
    </>
}

export default Account