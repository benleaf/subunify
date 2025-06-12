import ColorGlassCard from "@/components/glassmorphism/ColorGlassCard"
import GlassIconText from "@/components/glassmorphism/GlassIconText"
import GlassText from "@/components/glassmorphism/GlassText"
import { useDashboard } from "@/contexts/DashboardContext"
import { useUpload } from "@/contexts/UploadContext"
import { getFileSize } from "@/helpers/FileSize"
import { ProjectPreviewResult } from "@/types/server/ProjectResult"
import { Edit } from "@mui/icons-material"
import { Stack, TextField, Divider } from "@mui/material"

const Projects = () => {
    const { properties, updateProperties } = useDashboard()
    const { projectDataStored } = useUpload()

    const setSelectedProject = async (projectPreview: ProjectPreviewResult) => {
        updateProperties({ page: 'project', selectedProjectId: projectPreview.id })
    }

    const acceptedProjects = properties.projects?.filter(project => project.inviteAccepted)

    return <Stack spacing={1}>
        <TextField label='Search Projects' />
        {!acceptedProjects?.length && <ColorGlassCard paddingSize="small" onClick={() => updateProperties({ page: 'createProject' })}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                    <GlassIconText size="large" icon={<Edit />}>Create New Project</GlassIconText>
                    <GlassText size="small">Create - Invite - Add Storage - Upload - Share</GlassText>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                    <GlassText size="small">Free</GlassText>
                </div>
            </div>
        </ColorGlassCard>}
        {acceptedProjects?.map(project =>
            <ColorGlassCard paddingSize="small" onClick={() => setSelectedProject(project)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                        <GlassText size="large">{project.name}</GlassText>
                        <GlassText size="moderate">{project.description}</GlassText>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                            <GlassText size="large">{getFileSize(projectDataStored[project.id])}</GlassText>
                            <GlassText size="small">Uploaded</GlassText>
                        </div>
                        <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                        <div>
                            <GlassText size="large">{project.availableTBs} TB</GlassText>
                            <GlassText size="small">Available</GlassText>
                        </div>
                        <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                        <div>
                            <GlassText size="large">{project.collaborators}</GlassText>
                            <GlassText size="small">Collaborators</GlassText>
                        </div>
                    </div>
                </div>
            </ColorGlassCard>
        )}
    </Stack>
}

export default Projects