import { Button, ButtonBase, Stack } from "@mui/material";
import GlassText from "../../glassmorphism/GlassText";
import GlassCard from "../../glassmorphism/GlassCard";
import GlassSpace from "../../glassmorphism/GlassSpace";
import DynamicStack from "../../glassmorphism/DynamicStack";

const SelectPackage = () => {
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
                <ButtonBase style={{ width: '100%', height: '100%' }}>
                    <Stack>
                        <GlassText size="big">Standard Project</GlassText>
                        <GlassText size="moderate">2TB for $249</GlassText>
                    </Stack>
                </ButtonBase>
            </GlassCard>
            <GlassCard flex={1} paddingSize="moderate" marginSize="moderate" height='30vh'>
                <ButtonBase style={{ width: '100%', height: '100%' }}>
                    <Stack>
                        <GlassText size="big">Pro Project</GlassText>
                        <GlassText size="moderate">5TB for $499</GlassText>
                    </Stack>
                </ButtonBase>
            </GlassCard>
            <GlassCard flex={1} paddingSize="moderate" marginSize="moderate" height='30vh'>
                <ButtonBase style={{ width: '100%', height: '100%' }}>
                    <Stack>
                        <GlassText size="big">Enterprise Project</GlassText>
                        <GlassText size="moderate">20TB for $1749</GlassText>
                    </Stack>
                </ButtonBase >
            </GlassCard>
        </DynamicStack >
    </>
}

export default SelectPackage