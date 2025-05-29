import ColorGlassCard from "@/components/glassmorphism/ColorGlassCard"
import GlassSpace from "@/components/glassmorphism/GlassSpace"
import GlassText from "@/components/glassmorphism/GlassText"
import { useDashboard } from "@/contexts/DashboardContext"
import { getFileSize } from "@/helpers/FileSize"
import { ArrowCircleLeft, Download } from "@mui/icons-material"
import { Stack, Divider, Button, IconButton } from "@mui/material"

const Cluster = () => {
    const { properties, updateProperties } = useDashboard()

    return <Stack spacing={1}>
        <Stack spacing={1}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => updateProperties({ page: 'project' })} size="large">
                    <ArrowCircleLeft fontSize="large" />
                </IconButton>
                <GlassText size="large">{properties!.selectedCluster?.name}</GlassText>
            </div>
            {properties.selectedCluster!.files!.map(file =>
                <ColorGlassCard width='100%' paddingSize="tiny" flex={1}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <img src={file.previewUrl} width={100} height='100%' style={{ objectFit: 'contain' }} />
                        <GlassSpace size="tiny" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
                            <Stack direction='row' spacing={1} alignItems='center'>
                                <div style={{ minWidth: 200 }}>
                                    <GlassText size="large">{file.name}</GlassText>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={1} alignItems='center'>
                                <Button startIcon={<Download />} variant="outlined">RAW</Button>
                                <Button startIcon={<Download />} variant="outlined">High Res</Button>
                                <Button startIcon={<Download />} variant="outlined">Low Res</Button>
                            </Stack>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 200 }}>
                            <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                            <div>
                                <GlassText size="small">Location</GlassText>
                                <GlassText size="moderate">{file.location}</GlassText>
                            </div>
                            <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                            <GlassText size="moderate">{getFileSize(file.size)}</GlassText>
                        </div>
                    </div>
                </ColorGlassCard>
            )}
        </Stack>
    </Stack>
}

export default Cluster