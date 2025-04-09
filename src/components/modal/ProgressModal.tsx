import { LinearProgress, Stack } from "@mui/material";
import GlassSpace from "../glassmorphism/GlassSpace";
import BaseModal from "./BaseModal";
import GlassText from "../glassmorphism/GlassText";

type Props = {
    progress: number,
}

const ProgressModal = ({ progress }: Props) => {
    return <BaseModal state={(progress && progress < 100) ? 'open' : 'closed'}>
        <GlassSpace size="huge">
            <Stack direction="row" spacing={2} alignItems="center">
                <LinearProgress value={progress} variant="determinate" style={{ flex: 1 }} />
                <GlassText size="moderate">
                    {progress.toFixed(1)}%
                </GlassText>
            </Stack>
        </GlassSpace>
    </BaseModal>
};

export default ProgressModal