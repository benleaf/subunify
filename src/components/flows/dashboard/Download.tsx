import GlassText from "@/components/glassmorphism/GlassText"
import { useDashboard } from "@/contexts/DashboardContext"
import { Stack, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material"
import { Download as DownloadIcon } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { FileQuality } from "@/types/FileQuality"
import ProjectSummarySubpage from "@/components/widgets/ProjectSummarySubpage"
import GlassSpace from "@/components/glassmorphism/GlassSpace"
import { isError } from "@/api/isError"
import { getFileSize } from "@/helpers/FileSize"

const Download = () => {
    const { downloadAction, authAction } = useAuth()
    const { properties } = useDashboard()
    const [quality, setQuality] = useState<FileQuality>('HIGH')
    const [bytes, setBytes] = useState<number>(0)

    useEffect(() => {
        authAction<number>(`file-download/project/${properties.selectedProjectId}/${quality}`, 'GET').then(result => {
            if (!isError(result)) setBytes(result)
        })

    }, [quality])

    const downloadProject = async () => {
        if (isError(bytes)) throw new Error("Unable to get bytes in project");

        await downloadAction(`file-download/project/${properties.selectedProjectId}/${quality}`, bytes)
    }

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
                            onChange={e => setQuality(e.target.value as FileQuality)}
                        >
                            <MenuItem value='RAW'>Raw</MenuItem>
                            <MenuItem value='HIGH'>High</MenuItem>
                            <MenuItem value='MEDIUM'>Medium</MenuItem>
                            <MenuItem value='LOW'>Low</MenuItem>
                        </Select>
                    </FormControl>
                    <GlassText size="moderate">
                        {getFileSize(bytes)}
                    </GlassText>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() => downloadProject()}
                    >
                        Download
                    </Button>
                </GlassSpace>
            </Stack>
        </GlassSpace>
    </Stack >
}

export default Download