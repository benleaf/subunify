import { Alert, CircularProgress, LinearProgress, Stack } from "@mui/material";
import GlassSpace from "../glassmorphism/GlassSpace";
import BaseModal from "./BaseModal";
import GlassText from "../glassmorphism/GlassText";

type Props = {
    fileProgress: number,
    totalProgress: number,
    eta?: string,
    currentFileName?: string
}

const ProgressModal = ({ fileProgress, totalProgress, eta, currentFileName }: Props) => {
    return <BaseModal state={fileProgress > 0 ? 'open' : 'closed'}>
        <GlassSpace size="huge">
            {(fileProgress < 100 || totalProgress < 100) && <>
                <GlassText size="moderate">
                    {currentFileName}
                </GlassText>
                <Stack direction="row" spacing={2} alignItems="center">
                    <LinearProgress value={fileProgress} variant="determinate" style={{ flex: 1 }} />
                    <GlassText size="moderate">
                        {fileProgress.toFixed(1)}%
                    </GlassText>
                </Stack>
                <GlassText size="moderate">
                    Total Progress
                </GlassText>
                <Stack direction="row" spacing={2} alignItems="center">
                    <LinearProgress value={totalProgress} variant="determinate" style={{ flex: 1 }} />
                    <GlassText size="moderate">
                        {totalProgress.toFixed(1)}%
                    </GlassText>
                </Stack>
                {eta && <GlassText size="moderate">
                    Approximately {eta} remaining
                </GlassText>}
            </>}
            {fileProgress == 100 && totalProgress == 100 && <>
                <CircularProgress />
            </>}
        </GlassSpace>
        <Alert
            severity='warning'
        >
            Upload in progress, please do not close the tab or refresh.
        </Alert>
    </BaseModal>
};

export default ProgressModal