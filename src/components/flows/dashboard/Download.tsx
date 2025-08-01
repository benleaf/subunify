import GlassText from "@/components/glassmorphism/GlassText"
import { useDashboard } from "@/contexts/DashboardContext"
import { Stack, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material"
import { Download as DownloadIcon } from "@mui/icons-material"
import { useEffect, useState } from "react"
import ProjectSummarySubpage from "@/components/widgets/ProjectSummarySubpage"
import GlassSpace from "@/components/glassmorphism/GlassSpace"
import { getFileSize } from "@/helpers/FileSize"
import { useAction } from "@/contexts/actions/infrastructure/ActionContext"
import { ProxySettingTypes } from "@/types/server/ProxySettingTypes"

const Download = () => {
    const { getProjectBytes, downloadProject } = useAction()
    const { properties } = useDashboard()
    const [quality, setQuality] = useState<ProxySettingTypes>('RAW')
    const [bytes, setBytes] = useState<number>()

    useEffect(() => {
        getProjectBytes(properties.selectedProjectId!, quality).then(result => setBytes(result))
    }, [quality])

    return <Stack spacing={1}>
        <ProjectSummarySubpage name="Download" />
        <GlassSpace size="small">
            <Stack maxWidth={600} spacing={1}>
                <GlassSpace size="tiny" style={{ flex: 1 }}>
                    <GlassText size="moderate">
                        Download all files in project
                    </GlassText>
                    <GlassSpace size="tiny" />
                    <FormControl fullWidth>
                        <InputLabel>Quality</InputLabel>
                        <Select
                            label='Quality'
                            value={quality}
                            onChange={e => setQuality(e.target.value as ProxySettingTypes)}
                        >
                            <MenuItem value='RAW'>Raw</MenuItem>
                        </Select>
                    </FormControl>
                    <GlassText size="moderate">
                        {getFileSize(bytes ?? 0)}
                    </GlassText>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() => downloadProject(quality, properties.selectedProjectId, bytes)}
                    >
                        Download
                    </Button>
                </GlassSpace>
            </Stack>
        </GlassSpace>
    </Stack >
}

export default Download