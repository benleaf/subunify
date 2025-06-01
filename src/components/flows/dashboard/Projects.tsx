import { isError } from "@/api/isError"
import ColorGlassCard from "@/components/glassmorphism/ColorGlassCard"
import GlassText from "@/components/glassmorphism/GlassText"
import { useAuth } from "@/contexts/AuthContext"
import { useDashboard } from "@/contexts/DashboardContext"
import { ProjectPreviewResult, ProjectResult } from "@/types/server/ProjectResult"
import { Stack, TextField, Divider } from "@mui/material"

const Projects = () => {
    const { properties, updateProperties } = useDashboard()

    const { authAction } = useAuth()
    const setSelectedProject = async (projectPreview: ProjectPreviewResult) => {
        const projectResult = await authAction<ProjectResult>(`project/user-project/${projectPreview.id}`, 'GET')
        if (!isError(projectResult) && projectResult) {
            updateProperties({ page: 'project', selectedProject: projectResult })
        }
    }

    return <Stack spacing={1}>
        <TextField label='Search Projects' />
        {properties.projects?.map(project =>
            <ColorGlassCard paddingSize="small" onClick={() => setSelectedProject(project)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <GlassText size="large">{project.name}</GlassText>
                        <GlassText size="moderate">{project.description}</GlassText>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <GlassText size="large">{project.totalUploaded} TB</GlassText>
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