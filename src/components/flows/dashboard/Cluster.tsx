import GlassText from "@/components/glassmorphism/GlassText"
import ListLayout from "@/components/layouts/file/ListLayout"
import { useDashboard } from "@/contexts/DashboardContext"
import { ArrowCircleLeft } from "@mui/icons-material"
import { Stack, IconButton } from "@mui/material"

const Cluster = () => {
    const { properties, updateProperties } = useDashboard()

    return <Stack spacing={1}>
        <Stack spacing={1} height='100%'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => updateProperties({ page: 'project' })} size="large">
                    <ArrowCircleLeft fontSize="large" />
                </IconButton>
                <GlassText size="large">{properties!.selectedCluster?.name}</GlassText>
            </div>
            <ListLayout files={properties.selectedCluster?.files ?? []} />
        </Stack>
    </Stack>
}

export default Cluster