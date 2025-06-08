import ColorGlassCard from "@/components/glassmorphism/ColorGlassCard"
import GlassText from "@/components/glassmorphism/GlassText"
import { useDashboard } from "@/contexts/DashboardContext"
import { ClusterResult } from "@/types/server/ProjectResult"
import { Stack, Divider, Button, IconButton } from "@mui/material"
import Carousel, { ResponsiveType } from "react-multi-carousel"
import { Add, ArrowCircleLeft, Upload } from "@mui/icons-material"
import { useEffect } from "react"
import { getFileSize, terabytesToBytes } from "@/helpers/FileSize"
import { ClusterManager } from "@/helpers/ClusterManager"
import { useThumbnail } from "@/contexts/ThumbnailContext"
import { useUpload } from "@/contexts/UploadContext"

const Project = () => {
    const { projectDataStored } = useUpload()
    const { getUrl, retrieveThumbnails } = useThumbnail()
    const { properties, updateProperties, loadProject } = useDashboard()
    const responsive: ResponsiveType = {
        desktop: {
            breakpoint: { max: Infinity, min: 0 },
            items: 1,
        }
    };

    const clusters: ClusterResult[] = ClusterManager.getClusters(properties.selectedProject?.files ?? [])

    useEffect(() => {
        loadProject()
    }, [])

    useEffect(() => {
        retrieveThumbnails(properties.selectedProject?.files ?? [])
    }, [properties.selectedProject?.id])

    const totalBytesUploaded = properties.selectedProject ? projectDataStored[properties.selectedProject.id] : 0
    const canUpload = terabytesToBytes(properties.selectedProject?.availableTBs ?? 0) > totalBytesUploaded

    return <Stack spacing={1}>
        <ColorGlassCard paddingSize="small">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <IconButton onClick={() => updateProperties({ page: 'projects', selectedProjectId: undefined, selectedProject: undefined })} size="large">
                        <ArrowCircleLeft fontSize="large" />
                    </IconButton>
                    <div>
                        <GlassText size="large">{properties.selectedProject?.name}</GlassText>
                        <GlassText size="moderate">{properties.selectedProject?.description}</GlassText>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                        <GlassText size="large">{getFileSize(totalBytesUploaded)}</GlassText>
                        <GlassText size="small">Uploaded</GlassText>
                    </div>
                    <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                    <div>
                        <GlassText size="large">{properties.selectedProject?.collaborators}</GlassText>
                        <GlassText size="small">Collaborators</GlassText>
                    </div>
                    <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                    <Button variant="contained" startIcon={<Add />} onClick={() => updateProperties({ page: 'addStorage' })}>Add Storage</Button>
                    <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                    {canUpload && <Button
                        variant="contained"
                        startIcon={<Upload />}
                        onClick={() => updateProperties({ page: 'upload', selectedProjectId: properties.selectedProject?.id })}
                    >
                        Upload
                    </Button>}
                </div>
            </div>
        </ColorGlassCard>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {clusters!.map(cluster =>
                <ColorGlassCard style={{ minWidth: 'max(30%, 300px)' }} paddingSize="small" marginSize="tiny" flex={1}>
                    <div style={{ borderRadius: 15, overflow: 'hidden', backgroundColor: 'black', height: 300 }}>
                        <Carousel
                            showDots={cluster.fileCount <= 10}
                            responsive={responsive}
                            infinite={true}
                            removeArrowOnDeviceType={["tablet", "mobile"]}
                        >
                            {cluster.files.map(file =>
                                getUrl(file) ?
                                    <img src={getUrl(file)} loading="lazy" height={330} width='100%' style={{ objectFit: 'cover' }} /> :
                                    <div style={{ display: 'flex', height: 300, justifyContent: 'center', alignItems: 'center' }}>
                                        <GlassText size="large" color="white">{file.name}</GlassText>
                                    </div>
                            )}
                        </Carousel>
                    </div>
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <GlassText size="large">{cluster.name}</GlassText>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                                <div style={{ width: 40 }}>
                                    <GlassText size="large">{cluster.fileCount}</GlassText>
                                    <GlassText size="small">Files</GlassText>
                                </div>
                            </div>
                        </div>
                        <Button variant="outlined" fullWidth onClick={() => updateProperties({ page: 'cluster', selectedCluster: cluster })}>View</Button>
                    </div>
                </ColorGlassCard>
            )}
            <div style={{ flex: 1, minWidth: 'max(30%, 300px)', display: 'flex', height: 300, margin: 20 }} />
        </div>
    </Stack >
}

export default Project