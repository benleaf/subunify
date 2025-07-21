import { getFileSize } from "@/helpers/FileSize"
import { ArrowCircleLeft } from "@mui/icons-material"
import { IconButton, Divider, Stack } from "@mui/material"
import GlassText from "../glassmorphism/GlassText"
import { useDashboard } from "@/contexts/DashboardContext"
import { useUpload } from "@/contexts/UploadContext"
import { useThumbnail } from "@/contexts/ThumbnailContext"

type Props = {
    name: string
}

const ProjectSummarySubpage = ({ name }: Props) => {
    const { projectDataStored } = useUpload()
    const { retrieveThumbnails } = useThumbnail()
    const { properties, updateProperties, loadProject } = useDashboard()
    const totalBytesUploaded = properties.selectedProject ? projectDataStored[properties.selectedProject.id] : 0

    const backToProject = async () => {
        const project = await loadProject(properties.selectedProjectId)
        await retrieveThumbnails(project?.files ?? [])
        updateProperties({ page: 'project' })
    }

    return <Stack spacing={1}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => backToProject()} size="large">
                    <ArrowCircleLeft fontSize="large" />
                </IconButton>
                <GlassText size="large"><b>{name}</b> {properties.selectedProject?.name}</GlassText>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                <div>
                    <GlassText size="large">{Math.floor((properties.selectedProject?.availableTranscodeSeconds ?? 0) / 60)} Minutes</GlassText>
                    <GlassText size="small">Processable Video</GlassText>
                </div>
                <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                <div>
                    <GlassText size="large">{getFileSize(properties.selectedProject?.restoreBytes ?? 0)}</GlassText>
                    <GlassText size="small">Restorable</GlassText>
                </div>
                <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                <div>
                    <GlassText size="large">{properties.selectedProject?.availableTBs} TB</GlassText>
                    <GlassText size="small">Available</GlassText>
                </div>
                <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                <div>
                    <GlassText size="large">{getFileSize(totalBytesUploaded)}</GlassText>
                    <GlassText size="small">Uploaded</GlassText>
                </div>
            </div>
        </div>
    </Stack>
}

export default ProjectSummarySubpage