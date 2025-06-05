import ColorGlassCard from "@/components/glassmorphism/ColorGlassCard"
import GlassText from "@/components/glassmorphism/GlassText"
import { useDashboard } from "@/contexts/DashboardContext"
import { ProjectPreviewResult } from "@/types/server/ProjectResult"
import { Stack, TextField, Divider } from "@mui/material"

const Projects = () => {
    const { properties, updateProperties } = useDashboard()

    const setSelectedProject = async (projectPreview: ProjectPreviewResult) => {
        updateProperties({ page: 'project', selectedProjectId: projectPreview.id })
    }

    const acceptedProjects = properties.projects?.filter(project => project.inviteAccepted)

    return <Stack spacing={1}>
        <TextField label='Search Projects' />
        {acceptedProjects?.map(project =>
            <ColorGlassCard paddingSize="small" onClick={() => setSelectedProject(project)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <GlassText size="large">{project.name}</GlassText>
                        <GlassText size="moderate">{project.description}</GlassText>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <GlassText size="large">{project.availableTBs} TB</GlassText>
                            <GlassText size="small">Available</GlassText>
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