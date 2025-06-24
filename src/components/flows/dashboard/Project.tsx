import ColorGlassCard from "@/components/glassmorphism/ColorGlassCard"
import GlassText from "@/components/glassmorphism/GlassText"
import { useDashboard } from "@/contexts/DashboardContext"
import { Stack, Divider, Fab } from "@mui/material"
import { DataSaverOn, Upload, List, Dashboard, GridOn } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { useThumbnail } from "@/contexts/ThumbnailContext"
import GlassIconText from "@/components/glassmorphism/GlassIconText"
import ProjectSummary from "@/components/widgets/ProjectSummary"
import ClusterLayout from "@/components/layouts/file/ClusterLayout"
import ListLayout from "@/components/layouts/file/ListLayout"
import GridLayout from "@/components/layouts/file/GridLayout"

type Layouts = 'cluster' | 'list' | 'grid'

const Project = () => {
    const { retrieveThumbnails } = useThumbnail()
    const { properties, updateProperties, loadProject } = useDashboard()
    const oldLayoutType = localStorage.getItem('fileLayoutType') as Layouts
    const [layout, setLayout] = useState<Layouts>(oldLayoutType ?? 'list')

    useEffect(() => {
        localStorage.setItem('fileLayoutType', layout)
    }, [layout])

    useEffect(() => {
        loadProject()
    }, [])

    const files = properties.selectedProject?.files ?? []

    useEffect(() => {
        retrieveThumbnails(files)
    }, [properties.selectedProject?.id])

    return <Stack spacing={1}>
        <ProjectSummary />
        {files.length > 0 && <div style={{ display: 'flex', justifyContent: 'end' }}>
            <Stack direction='row' spacing={1}>
                <Fab
                    onClick={_ => setLayout('list')}
                    color={layout == 'list' ? 'primary' : 'inherit'}
                    size='small'
                >
                    <List fontSize="large" />
                </Fab>
                <Fab
                    onClick={_ => setLayout('cluster')}
                    color={layout == 'cluster' ? 'primary' : 'inherit'}
                    size='small'
                >
                    <Dashboard />
                </Fab>
                <Fab
                    onClick={_ => setLayout('grid')}
                    color={layout == 'grid' ? 'primary' : 'inherit'}
                    size='small'
                >
                    <GridOn />
                </Fab>
            </Stack>
        </div>}
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {!properties.selectedProject?.availableTBs &&
                <ColorGlassCard paddingSize="small" onClick={() => updateProperties({ page: 'addStorage' })} width='100%'>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                            <GlassIconText size="large" icon={<DataSaverOn />}>Add Storage</GlassIconText>
                            <GlassText size="small">Add storage to allow high speed uploads to this project</GlassText>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                            <GlassText size="small">$117/TB</GlassText>
                        </div>
                    </div>
                </ColorGlassCard>
            }
            {(properties.selectedProject?.availableTBs ?? 0) > 0 && !files?.length &&
                <ColorGlassCard paddingSize="small" onClick={() => updateProperties({ page: 'upload' })} width='100%'>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                            <GlassIconText size="large" icon={<Upload />}>Upload Files To Project</GlassIconText>
                            <GlassText size="small">Upload files for you and your collaborators.</GlassText>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                            <GlassText size="small">Included</GlassText>
                        </div>
                    </div>
                </ColorGlassCard>
            }
            {layout == 'cluster' && <ClusterLayout files={files} />}
            {layout == 'list' && <ListLayout files={files} />}
            {layout == 'grid' && <GridLayout files={files} />}
        </div>
    </Stack >
}

export default Project