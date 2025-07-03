import { ArrowCircleLeft, Layers } from "@mui/icons-material"
import { IconButton, Divider, Button } from "@mui/material"
import ColorGlassCard from "../glassmorphism/ColorGlassCard"
import GlassText from "../glassmorphism/GlassText"
import { useDashboard } from "@/contexts/DashboardContext"

const ProjectSummary = () => {
    const { properties, updateProperties } = useDashboard()

    return <ColorGlassCard paddingSize="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IconButton onClick={() => updateProperties({
                    page: 'projects',
                    selectedProjectId: undefined,
                    selectedProject: undefined,
                    collaborators: undefined,
                    projectRole: undefined
                })} size="large">
                    <ArrowCircleLeft fontSize="large" />
                </IconButton>
                <div>
                    <GlassText size="large">{properties.selectedProject?.name}</GlassText>
                    <GlassText size="moderate">{properties.selectedProject?.description}</GlassText>
                </div>
            </div>
            <div style={{ flex: 1 }} />
            <Button
                variant="outlined"
                startIcon={<Layers />}
                onClick={() => updateProperties({ page: 'manageProject' })}
            >
                Project Actions
            </Button>
            <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <GlassText size="large">{properties.selectedProject?.files.length}</GlassText>
                <GlassText size="small">Files Uploaded</GlassText>
            </div>
        </div>
    </ColorGlassCard>
}

export default ProjectSummary