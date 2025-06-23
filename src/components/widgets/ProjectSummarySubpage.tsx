import { getFileSize } from "@/helpers/FileSize"
import { ArrowCircleLeft } from "@mui/icons-material"
import { IconButton, Divider, Stack } from "@mui/material"
import GlassText from "../glassmorphism/GlassText"
import { useDashboard } from "@/contexts/DashboardContext"
import { useUpload } from "@/contexts/UploadContext"

type Props = {
    name: string
}

const ProjectSummarySubpage = ({ name }: Props) => {
    const { projectDataStored } = useUpload()
    const { properties, updateProperties } = useDashboard()
    const totalBytesUploaded = properties.selectedProject ? projectDataStored[properties.selectedProject.id] : 0

    return <Stack spacing={1}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => updateProperties({ page: 'project' })} size="large">
                    <ArrowCircleLeft fontSize="large" />
                </IconButton>
                <GlassText size="large"><b>{name}</b> {properties.selectedProject?.name}</GlassText>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
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