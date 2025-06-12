import { Stack } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import GlassText from "@/components/glassmorphism/GlassText";

const PrivacyPolicy = () => {
    return <GlassSpace size="tiny" style={{ overflowY: 'scroll', height: '83vh' }}>
        <Stack spacing={1} maxWidth={800}>
            <GlassText size="big">SUBUNIFY Privacy Policy is currently being written</GlassText>
        </Stack>
    </GlassSpace>
}

export default PrivacyPolicy
