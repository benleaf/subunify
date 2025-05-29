import ColorGlassCard from "@/components/glassmorphism/ColorGlassCard"
import GlassText from "@/components/glassmorphism/GlassText"
import { useDashboard } from "@/contexts/DashboardContext"
import { Stack, TextField, Divider } from "@mui/material"
import test from '@/images/man-holding-camera.jpg'
import test2 from '@/images/DoubleExposureGraphic.png'
import { ProjectResult } from "@/types/server/ProjectResult"

const Projects = () => {
    const { properties, updateProperties } = useDashboard()

    const projectFromServer: ProjectResult = {
        clusters: [
            { id: 'test', name: '3-4pm This is to test extra long text that may not fit', previewImages: [test, test2, test2, test2, test2, test2], fileCount: 11 },
            { id: 'test', name: '4-5pm', previewImages: [test, test2], fileCount: 9 },
            { id: 'test', name: '5-6pm', previewImages: [test, test2], fileCount: 2 },
        ],
        id: '1',
        name: 'Apple V1',
        description: 'This is an example project',
        uploaded: 1.5,
        collaborators: 2,
        daysToArchive: 90
    }

    return <Stack spacing={1}>
        <TextField label='Search Projects' />
        {properties.projects?.map(project =>
            <ColorGlassCard paddingSize="small" onClick={() => updateProperties({ page: 'project', selectedProject: projectFromServer })}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <GlassText size="large">{project.name}</GlassText>
                        <GlassText size="moderate">{project.description}</GlassText>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <GlassText size="large">{project.uploaded} TB</GlassText>
                            <GlassText size="small">Uploaded</GlassText>
                        </div>
                        <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                        <div>
                            <GlassText size="large">{project.collaborators}</GlassText>
                            <GlassText size="small">Collaborators</GlassText>
                        </div>
                        <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                        <div>
                            <GlassText size="small">Time until Archive</GlassText>
                            <GlassText size="small">{project.daysToArchive} days</GlassText>
                        </div>
                    </div>
                </div>
            </ColorGlassCard>
        )}
    </Stack>
}

export default Projects