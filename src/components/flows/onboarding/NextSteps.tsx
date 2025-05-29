import { ButtonBase } from "@mui/material";
import GlassText from "../../glassmorphism/GlassText";
import GlassCard from "../../glassmorphism/GlassCard";
import GlassSpace from "../../glassmorphism/GlassSpace";
import DynamicStack from "../../glassmorphism/DynamicStack";

const NextSteps = () => {
    return <>
        <GlassText size='massive'>
            Let's <b>Roll!</b>
        </GlassText>
        <GlassText size='large'>
            Where you go now is up to you!
        </GlassText>
        <GlassSpace size="moderate" />
        <DynamicStack>
            <GlassCard flex={1} paddingSize="moderate" marginSize="moderate" height='30vh'>
                <ButtonBase style={{ width: '100%', height: '100%' }} href="/start-project">
                    <GlassText size="big">Start a project</GlassText>
                </ButtonBase>
            </GlassCard>
            <GlassCard flex={1} paddingSize="moderate" marginSize="moderate" height='30vh'>
                <ButtonBase style={{ width: '100%', height: '100%' }}>
                    <GlassText size="big">Join a project</GlassText>
                </ButtonBase >
            </GlassCard>
        </DynamicStack >
        <GlassCard flex={1} paddingSize="moderate" marginSize="moderate">
            <ButtonBase style={{ width: '100%', height: '100%' }} href="/dashboard">
                <GlassText size="big">Dashboard</GlassText>
            </ButtonBase >
        </GlassCard>
    </>
}

export default NextSteps