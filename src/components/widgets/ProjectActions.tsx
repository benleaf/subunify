import { ScreenWidths } from "@/constants/ScreenWidths"
import { useAuth } from "@/contexts/AuthContext"
import { useDashboard } from "@/contexts/DashboardContext"
import { useUpload } from "@/contexts/UploadContext"
import { terabytesToBytes } from "@/helpers/FileSize"
import { useSize } from "@/hooks/useSize"
import { Add, Upload, Download, CallToAction } from "@mui/icons-material"
import { Button, Stack } from "@mui/material"
import { useState } from "react"
import BaseModal from "../modal/BaseModal"
import GlassSpace from "../glassmorphism/GlassSpace"

const ProjectActions = () => {
    const { width } = useSize()
    const { user } = useAuth()
    const { projectDataStored } = useUpload()
    const { properties, updateProperties } = useDashboard()
    const amOwner = properties.selectedProject?.owner.email === user?.email

    const totalBytesUploaded = properties.selectedProject ? projectDataStored[properties.selectedProject.id] : 0
    const canUpload = terabytesToBytes(properties.selectedProject?.availableTBs ?? 0) > totalBytesUploaded
    const [open, setOpen] = useState(false);

    const options = <>
        {amOwner && <>
            <Button variant="contained" startIcon={<Add />} onClick={() => updateProperties({ page: 'addStorage' })}>Add Storage</Button>
        </>}
        {canUpload && <Button
            variant="contained"
            startIcon={<Upload />}
            onClick={() => updateProperties({ page: 'upload', selectedProjectId: properties.selectedProject?.id })}
        >
            Upload
        </Button>}
        <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => updateProperties({ page: 'download', selectedProjectId: properties.selectedProject?.id })}
        >
            Download
        </Button>
    </>

    if (width < ScreenWidths.Mobile) {
        return (
            <>
                <Button startIcon={<CallToAction />} variant="contained" onClick={_ => setOpen(true)} fullWidth>
                    Actions
                </Button>
                <BaseModal state={open} close={_ => setOpen(false)}>
                    <GlassSpace size="small">
                        <Stack direction='column' spacing={1}>
                            {options}
                        </Stack>
                    </GlassSpace>
                </BaseModal>
            </>
        );
    } else {
        return <Stack direction='row' spacing={1}>
            {options}
        </Stack>
    }

}

export default ProjectActions