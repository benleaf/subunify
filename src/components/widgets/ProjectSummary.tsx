import { getFileSize } from "@/helpers/FileSize"
import { ArrowCircleLeft } from "@mui/icons-material"
import { IconButton, Divider } from "@mui/material"
import ColorGlassCard from "../glassmorphism/ColorGlassCard"
import GlassText from "../glassmorphism/GlassText"
import ProjectActions from "./ProjectActions"
import { useDashboard } from "@/contexts/DashboardContext"
import { useUpload } from "@/contexts/UploadContext"

const ProjectSummary = () => {
    const { projectDataStored } = useUpload()
    const { properties, updateProperties } = useDashboard()
    const totalBytesUploaded = properties.selectedProject ? projectDataStored[properties.selectedProject.id] : 0

    return <ColorGlassCard paddingSize="small">
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
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                    <GlassText size="large">{getFileSize(totalBytesUploaded)}</GlassText>
                    <GlassText size="small">Uploaded</GlassText>
                </div>
                <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                <div>
                    <GlassText size="large">{properties.selectedProject?.availableTBs} TB</GlassText>
                    <GlassText size="small">Available</GlassText>
                </div>
                <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
            </div>
            {properties.selectedProjectId && <ProjectActions />}
        </div>
    </ColorGlassCard>
}

export default ProjectSummary