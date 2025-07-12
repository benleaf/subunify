import GlassSpace from "@/components/glassmorphism/GlassSpace"
import GlassText from "@/components/glassmorphism/GlassText"
import ProjectSummarySubpage from "@/components/widgets/ProjectSummarySubpage"
import { useAction } from "@/contexts/actions/infrastructure/ActionContext"
import { useDashboard } from "@/contexts/DashboardContext"
import { Stack, TextField, Divider, Button } from "@mui/material"
import { useState } from "react"

const WipeProject = () => {
    const { properties } = useDashboard()
    const { wipeProject } = useAction()
    const [fieldText, setFieldText] = useState('')

    const files = properties!.selectedProject?.files.length ?? 0

    return <Stack spacing={1}>
        <ProjectSummarySubpage name="Wipe Project" />
        <GlassSpace size='large' >
            <Stack spacing={1} height='100%' maxWidth={600}>
                <GlassText size="big"><b>What this means:</b></GlassText>
                <ol>
                    <li><GlassText size="large">Permanently Delete <b>{files}</b> File{files == 1 ? '' : 's'}</GlassText></li>
                    <li><GlassText size="large">Reset Restorable, Uploaded, and available counts to <b>zero</b></GlassText></li>
                    <li><GlassText size="large">Remove subscription associated with this project</GlassText></li>
                    <li><GlassText size="large">Unused data will be lost <b>forever</b></GlassText></li>
                    <li><GlassText size="large">Files will be deleted from any <b>share bundles</b> they exist in</GlassText></li>
                </ol>
                <Divider />
                <GlassText size="moderate">This action is not reversible, all files will be lost forever, proceed with caution!</GlassText>
                <TextField variant="outlined" label='Type "permanently wipe" to wipe project' onChange={e => setFieldText(e.target.value)} />
                <GlassText size="small" color="primary">Type "permanently wipe" to wipe project</GlassText>
                {properties.selectedProjectId !== undefined && <Button
                    variant="outlined"
                    disabled={fieldText != "permanently wipe"}
                    onClick={() => wipeProject(properties.selectedProjectId!)}
                >
                    Wipe
                </Button>}
            </Stack>
        </GlassSpace>
    </Stack>
}

export default WipeProject