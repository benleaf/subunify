import { useAuth } from "@/contexts/AuthContext";
import { Button, Stack } from "@mui/material";
import GlassText from "@/components/glassmorphism/GlassText";
import { useDashboard } from "@/contexts/DashboardContext";
import { useUpload } from "@/contexts/UploadContext";
import { terabytesToBytes } from "@/helpers/FileSize";
import { Add, Upload, Download, VideoSettings } from "@mui/icons-material";
import ColorGlassCard from "@/components/glassmorphism/ColorGlassCard";
import ProjectSummarySubpage from "@/components/widgets/ProjectSummarySubpage";
import { CssSizes } from "@/constants/CssSizes";

const ManageProject = () => {
    const { projectDataStored } = useUpload()
    const { properties, updateProperties } = useDashboard()

    const amOwner = properties?.projectRole == 'OWNER'
    const canManage = amOwner || properties?.projectRole == 'MANAGER'
    const totalBytesUploaded = properties.selectedProject ? projectDataStored[properties.selectedProject.id] : 0
    const spaceToUpload = terabytesToBytes(properties.selectedProject?.availableTBs ?? 0) > totalBytesUploaded
    const canUpload = spaceToUpload && properties?.projectRole && ['OWNER', 'COLLABORATOR', 'MANAGER'].includes(properties.projectRole)

    return <div>
        <Stack spacing={1} direction='column'>
            <ProjectSummarySubpage name='Manage' />
            <div style={{ display: 'flex', flexFlow: 'wrap', gap: '1em', justifyContent: 'center' }}>
                {amOwner && <ColorGlassCard flex={1} paddingSize="moderate" style={{ minWidth: 350, flexBasis: 0 }}>
                    <GlassText size="large">Add storage</GlassText>
                    <GlassText size="moderate" style={{ height: '4em' }}>Buy and add additional storage capacity to this project</GlassText>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => updateProperties({ page: 'addStorage' })}
                    >Add Storage</Button>
                </ColorGlassCard>}
                {canUpload && <ColorGlassCard flex={1} paddingSize="moderate" style={{ minWidth: 350, flexBasis: 0 }}>
                    <GlassText size="large">Upload</GlassText>
                    <GlassText size="moderate" style={{ height: '4em' }}>Upload files that can be accessed by all collaborators on this project</GlassText>
                    <Button
                        variant="contained"
                        startIcon={<Upload />}
                        onClick={() => updateProperties({ page: 'upload' })}
                    >
                        Upload
                    </Button>
                </ColorGlassCard>}
                <ColorGlassCard flex={1} paddingSize="moderate" style={{ minWidth: 350, flexBasis: 0 }}>
                    <GlassText size="large">Download</GlassText>
                    <GlassText size="moderate" style={{ height: '4em' }}>Download all files on this project at a specified quality level as a zip</GlassText>
                    <Button
                        variant="contained"
                        startIcon={<Download />}
                        onClick={() => updateProperties({ page: 'download' })}
                    >
                        Download
                    </Button>
                </ColorGlassCard>
                {canManage && <ColorGlassCard flex={1} paddingSize="moderate" style={{ minWidth: 350, flexBasis: 0 }}>
                    <GlassText size="large">Advanced File Settings</GlassText>
                    <GlassText size="moderate" style={{ height: '4em' }}>Advanced file settings. Specify video codec for proxies</GlassText>
                    <Button
                        variant="contained"
                        startIcon={<VideoSettings />}
                        onClick={() => updateProperties({ page: 'advancedFileSettings' })}
                    >
                        File Settings
                    </Button>
                </ColorGlassCard>}

                {/* Not ideal: This makes sure that any stray cards on their own row have the same width as the others */}
                <div style={{ flex: 1, minWidth: 350, padding: CssSizes.moderate }} />
                <div style={{ flex: 1, minWidth: 350, padding: CssSizes.moderate }} />
                <div style={{ flex: 1, minWidth: 350, padding: CssSizes.moderate }} />
            </div>
        </Stack>
    </div>
}

export default ManageProject
