import ColorGlassCard from "@/components/glassmorphism/ColorGlassCard"
import GlassText from "@/components/glassmorphism/GlassText"
import { useDashboard } from "@/contexts/DashboardContext"
import { ClusterResult, ProjectResult } from "@/types/server/ProjectResult"
import { Stack, Divider, Button, IconButton } from "@mui/material"
import Carousel, { ResponsiveType } from "react-multi-carousel"
import { Add, ArrowCircleLeft, Upload } from "@mui/icons-material"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { isError } from "@/api/isError"
import { getFileSize, terabytesToBytes } from "@/helpers/FileSize"

const Project = () => {
    const [thumbnails, setThumbnails] = useState<{ [id: string]: string }>({})
    const { properties, updateProperties, loadProject } = useDashboard()
    const { authAction } = useAuth()
    const responsive: ResponsiveType = {
        desktop: {
            breakpoint: { max: Infinity, min: 0 },
            items: 1,
        }
    };

    const clusters: ClusterResult[] = [{
        fileCount: properties.selectedProject?.files.length ?? 0,
        files: properties.selectedProject?.files ?? [],
        id: "1",
        name: "Test Cluster",
    }]

    useEffect(() => {
        loadProject()
    }, [])

    const getThumbnail = async (slide: number, cluster: ClusterResult) => {
        const file = cluster.files[slide % cluster.fileCount]
        if (!file || thumbnails[file.id]) return
        const response = await authAction<{ url: string }>(`storage-file/download/${file.id}/THUMBNAIL`, 'GET')
        if (!isError(response)) setThumbnails(old => ({ ...old, [file.id]: response.url }))
    }

    useEffect(() => {
        for (const cluster of clusters) getThumbnail(0, cluster)
    }, [properties.selectedProject?.id])

    const totalBytesUploaded = properties.selectedProject?.files
        .filter(file => file.created)
        .reduce((n, { bytes }) => n + +bytes, 0) ?? 0

    const canUpload = terabytesToBytes(properties.selectedProject?.availableTBs ?? 0) > totalBytesUploaded

    return <Stack spacing={1}>
        <ColorGlassCard paddingSize="small">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <IconButton onClick={() => updateProperties({ page: 'projects', selectedProjectId: undefined })} size="large">
                        <ArrowCircleLeft fontSize="large" />
                    </IconButton>
                    <div>
                        <GlassText size="large">{properties.selectedProject?.name}</GlassText>
                        <GlassText size="moderate">{properties.selectedProject?.description}</GlassText>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                    <div>
                        <GlassText size="small">Time until Archive</GlassText>
                        <GlassText size="small">{properties.selectedProject?.daysToArchive} days</GlassText>
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
                <ColorGlassCard width={350} paddingSize="small" marginSize="tiny" flex={1}>
                    <div style={{ borderRadius: 15, overflow: 'hidden', backgroundColor: 'black' }}>
                        <Carousel
                            showDots={cluster.fileCount <= 10}
                            responsive={responsive}
                            infinite={true}
                            removeArrowOnDeviceType={["tablet", "mobile"]}
                            beforeChange={(slide) => getThumbnail(slide - 1, cluster)}
                        >
                            {cluster.files.map(file =>
                                thumbnails[file.id] ?
                                    <img src={thumbnails[file.id]} loading="lazy" height={300} width='100%' style={{ objectFit: 'contain' }} /> :
                                    <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
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
            {clusters.length % 2 == 1 && <div style={{ flex: 1, minWidth: 300, display: 'flex', height: 300 }} />}
        </div>
    </Stack >
}

export default Project