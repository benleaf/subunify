import ColorGlassCard from "@/components/glassmorphism/ColorGlassCard"
import GlassText from "@/components/glassmorphism/GlassText"
import { useDashboard } from "@/contexts/DashboardContext"
import { getFileSize } from "@/helpers/FileSize"
import { ClusterResult } from "@/types/server/ProjectResult"
import { Stack, Divider, ImageList, Button, IconButton } from "@mui/material"
import Carousel, { ResponsiveType } from "react-multi-carousel"
import imageTest from '@/images/man-holding-camera.jpg'
import { ArrowCircleLeft, ArrowLeft, Upload } from "@mui/icons-material"

const Project = () => {
    const { properties, updateProperties } = useDashboard()
    const responsive: ResponsiveType = {
        desktop: {
            breakpoint: { max: Infinity, min: 0 },
            items: 1,
        }
    };

    const selectedCluster: ClusterResult = {
        fileCount: 10,
        files: [
            {
                id: 'test',
                location: 'INSTANT',
                modified: new Date(),
                name: 'Test-File-123.mov',
                previewUrl: imageTest,
                size: 4358934,
                uploaded: new Date()
            },
            {
                id: 'test',
                location: 'INSTANT',
                modified: new Date(),
                name: 'Test-File-123.mov',
                previewUrl: imageTest,
                size: 4358934,
                uploaded: new Date()
            },
            {
                id: 'test',
                location: 'INSTANT',
                modified: new Date(),
                name: 'Test-File-123.mov',
                previewUrl: imageTest,
                size: 4358934,
                uploaded: new Date()
            },
            {
                id: 'test',
                location: 'INSTANT',
                modified: new Date(),
                name: 'Test-File-123.mov',
                previewUrl: imageTest,
                size: 4358934,
                uploaded: new Date()
            },
            {
                id: 'test',
                location: 'INSTANT',
                modified: new Date(),
                name: 'Test-File-123.mov',
                previewUrl: imageTest,
                size: 4358934,
                uploaded: new Date()
            },
        ],
        id: 'test',
        name: '5:36pm - 6:24pm',
    }

    return <Stack spacing={1}>

        <ColorGlassCard paddingSize="small">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <IconButton onClick={() => updateProperties({ page: 'projects' })} size="large">
                        <ArrowCircleLeft fontSize="large" />
                    </IconButton>
                    <div>
                        <GlassText size="large">{properties.selectedProject!.name}</GlassText>
                        <GlassText size="moderate">{properties.selectedProject!.description}</GlassText>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <GlassText size="large">{properties.selectedProject!.uploaded} TB</GlassText>
                        <GlassText size="small">Uploaded</GlassText>
                    </div>
                    <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                    <div>
                        <GlassText size="large">{properties.selectedProject!.collaborators}</GlassText>
                        <GlassText size="small">Collaborators</GlassText>
                    </div>
                    <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                    <div>
                        <GlassText size="small">Time until Archive</GlassText>
                        <GlassText size="small">{properties.selectedProject!.daysToArchive} days</GlassText>
                    </div>
                    <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                    <Button variant="contained" startIcon={<Upload />} onClick={() => updateProperties({ page: 'upload' })}>Upload</Button>
                </div>
            </div>
        </ColorGlassCard>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {properties.selectedProject!.clusters!.map(cluster =>
                <ColorGlassCard width={350} paddingSize="small" marginSize="tiny" flex={1}>
                    <div style={{ borderRadius: 15, overflow: 'hidden', backgroundColor: 'black' }}>
                        <Carousel
                            showDots={cluster.previewImages.length <= 10}
                            responsive={responsive}
                            infinite={true}
                            removeArrowOnDeviceType={["tablet", "mobile"]}
                        >
                            {cluster.previewImages.map(imageSrc => <img src={imageSrc} height={300} width='100%' style={{ objectFit: 'contain' }} />)}
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
                        <Button variant="outlined" fullWidth onClick={() => updateProperties({ page: 'cluster', selectedCluster: selectedCluster })}>View</Button>
                    </div>
                </ColorGlassCard>

            )}
            {properties.selectedProject!.clusters.length % 2 == 1 && <div style={{ flex: 1, minWidth: 300, display: 'flex', height: 300 }} />}
        </div>
    </Stack >
}

export default Project