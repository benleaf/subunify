import { Divider } from "@mui/material";
import GlassText from "../../glassmorphism/GlassText";
import GlassSpace from "../../glassmorphism/GlassSpace";
import { useSearchParams } from "react-router";
import { CssSizes } from "@/constants/CssSizes";

const Welcome = () => {
    const [searchParams] = useSearchParams();
    const project = searchParams.get('project')

    return <>
        <div>
            <GlassText size='massive' style={{ lineHeight: CssSizes.moderate }}>
                <b>SUBUNIFY.</b>
            </GlassText>
            <GlassText size='moderate'>
                Your Collaborative Repository for Footage.
            </GlassText>
        </div>
        <GlassSpace size="tiny" />
        <GlassText size='large'>
            It's always been about the footage, that's what counts. Everything else is just a tool to get you there.
        </GlassText>
        <Divider style={{ margin: 20 }} />
        {project && <GlassText size='large'>
            We're excited to have you join <b>{project}</b>!
        </GlassText>}
        <GlassSpace size="moderate" />
    </>
}

export default Welcome