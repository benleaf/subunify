import { isError } from "@/api/isError"
import GlassText from "@/components/glassmorphism/GlassText"
import FileViewer from "@/components/widgets/FileViewer"
import { useAuth } from "@/contexts/AuthContext"
import { useDashboard } from "@/contexts/DashboardContext"
import { StoredFile } from "@/types/server/ProjectResult"
import { ArrowCircleLeft } from "@mui/icons-material"
import { Stack, IconButton } from "@mui/material"
import moment from "moment"
import { useEffect, useState } from "react"

const Cluster = () => {
    const { properties, updateProperties } = useDashboard()
    const { authAction } = useAuth()
    const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({})

    const getThumbnails = async (file: StoredFile) => {
        const response = await authAction<{ url: string }>(`storage-file/download/${file.id}/THUMBNAIL`, 'GET')
        if (!isError(response)) setThumbnails(old => ({ ...old, [file.id]: response.url }))
    }

    useEffect(() => {
        properties.selectedCluster!.files.map(getThumbnails)
    }, [])

    const sorted = properties.selectedCluster?.files.sort((a, b) => moment(a.fileLastModified).diff(b.fileLastModified))

    return <Stack spacing={1}>
        <Stack spacing={1} height='100%'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => updateProperties({ page: 'project' })} size="large">
                    <ArrowCircleLeft fontSize="large" />
                </IconButton>
                <GlassText size="large">{properties!.selectedCluster?.name}</GlassText>
            </div>
            {sorted?.map(file => <FileViewer file={file} thumbnail={thumbnails[file.id]} />)}
        </Stack>
    </Stack>
}

export default Cluster