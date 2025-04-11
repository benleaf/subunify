import { CircularProgress, LinearProgress, Stack } from "@mui/material";
import GlassSpace from "../glassmorphism/GlassSpace";
import BaseModal from "./BaseModal";
import GlassText from "../glassmorphism/GlassText";

type Props = {
    progressFile: number,
    progressS3: number,
}

const ProgressModal = ({ progressFile, progressS3 }: Props) => {
    return <BaseModal state={progressFile > 0 ? 'open' : 'closed'}>
        <GlassSpace size="huge">
            {progressS3 < 100 && <>
                <GlassText size="moderate">
                    File Upload
                </GlassText>
                <Stack direction="row" spacing={2} alignItems="center">
                    <LinearProgress value={progressFile} variant="determinate" style={{ flex: 1 }} />
                    <GlassText size="moderate">
                        {progressFile.toFixed(1)}%
                    </GlassText>
                </Stack>
                <GlassText size="moderate">
                    File Archiving
                </GlassText>
                <Stack direction="row" spacing={2} alignItems="center">
                    <LinearProgress value={progressS3} variant="determinate" style={{ flex: 1 }} />
                    <GlassText size="moderate">
                        {progressS3.toFixed(1)}%
                    </GlassText>
                </Stack>
            </>}
            {progressS3 == 100 && <>
                <CircularProgress />
            </>}
        </GlassSpace>
    </BaseModal>
};

export default ProgressModal