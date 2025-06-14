import FileAdder from "@/components/form/FileAdder"
import DynamicStack from "@/components/glassmorphism/DynamicStack"
import GlassCard from "@/components/glassmorphism/GlassCard"
import GlassText from "@/components/glassmorphism/GlassText"
import { CssSizes } from "@/constants/CssSizes"
import { ScreenWidths } from "@/constants/ScreenWidths"
import { useAuth } from "@/contexts/AuthContext"
import { useDashboard } from "@/contexts/DashboardContext"
import { useUpload } from "@/contexts/UploadContext"
import { getFileSize } from "@/helpers/FileSize"
import { Time } from "@/helpers/Time"
import { FileRecord } from "@/helpers/UploadManager"
import { useSize } from "@/hooks/useSize"
import { TaggedFile } from "@/pages/FileUpload"
import { ArrowCircleLeft } from "@mui/icons-material"
import { Stack, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, Chip, CircularProgress, LinearProgress, Divider } from "@mui/material"
import moment, { Moment } from "moment"
import { Fragment, useEffect, useState } from "react"

const Cluster = () => {
    const { setLoading, setAlert } = useAuth()
    const { uploadManager, projectDataStored } = useUpload()
    const { properties, updateProperties, loadProject } = useDashboard()
    const [totalUploaded, setTotalUploaded] = useState<number>()
    const [startTime, setStartTime] = useState<Moment>()
    const [eta, setEta] = useState<string>()
    const [mbps, setMbps] = useState<number>()
    const { width } = useSize()

    useEffect(() => {
        loadProject()
        uploadManager.addCallbacks({ addUploaded })
    }, [uploadManager])

    useEffect(() => {
        if (uploadManager.isRunning && !totalUploaded) {
            setLoading(true)
        } else if (totalUploaded && uploadManager.isRunning) {
            setLoading(false)

            const secondsElapsed = moment.duration(moment().diff(startTime)).asSeconds()
            const bitsPerSecond = totalUploaded / Math.max(1, secondsElapsed)
            const newMbps = ((bitsPerSecond) / 1024) / 1024
            setMbps(newMbps)
            uploadManager.setConcurrentUploads(newMbps ?? 1)

            const remainingBits = totalSize - totalUploaded
            const estimatedSecondsLeft = remainingBits / bitsPerSecond
            setEta(Time.formatDate(moment().add(estimatedSecondsLeft, 'seconds')))
        }
    }, [totalUploaded])

    const totalBytesUploaded = properties.selectedProject ? projectDataStored[properties.selectedProject.id] : 0

    const fileRecords = uploadManager.fileRecords
    const totalSize = !fileRecords?.length ? 1 :
        fileRecords.map(fileRecord => fileRecord.file.size)
            .reduce((acc, cur) => acc + cur)

    const totalProgress = ((totalUploaded ?? 0) / totalSize) * 100

    const addUploaded = (uploaded: number) => {
        setTotalUploaded(old => (old ?? 0) + uploaded)
    }

    const setTaggedFiles = (taggedFiles: TaggedFile[]) => {
        if (!startTime) setStartTime(moment())
        setAlert(`${taggedFiles.length} file${taggedFiles.length == 1 ? '' : 's'} added to upload queue`, 'success')

        const fileRecords: FileRecord[] = taggedFiles.map(file => ({
            description: '',
            file: file.file,
            projectId: properties.selectedProjectId!,
        }))

        if (uploadManager.isRunning) {
            uploadManager.update(fileRecords)
        } else if (fileRecords.length) {
            uploadManager.start(fileRecords)
        }
    }


    const displayableFiles = uploadManager.fileRecords.filter(file => !file.finished)

    return <Stack spacing={1}>
        <Stack spacing={1}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => updateProperties({ page: 'project' })} size="large">
                        <ArrowCircleLeft fontSize="large" />
                    </IconButton>
                    <GlassText size="large">Upload to {properties.selectedProject?.name}</GlassText>
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
        <DynamicStack>
            <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, flex: 1 }}>
                <FileAdder
                    totalBytesUploaded={totalBytesUploaded}
                    setTaggedFiles={setTaggedFiles}
                    availableTBs={properties.selectedProject?.availableTBs}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <GlassCard marginSize="moderate" paddingSize="moderate" flex={1}>
                        <Stack spacing={2}>
                            <>
                                <GlassText size="moderate">
                                    Total Progress
                                </GlassText>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <LinearProgress value={totalProgress} variant="determinate" style={{ flex: 1 }} />
                                    <GlassText size="moderate">
                                        {totalProgress.toFixed(1)}%
                                    </GlassText>
                                </Stack>
                                {mbps != undefined && <>
                                    <Chip label={`${mbps.toFixed(1)} Mbps`} style={{ marginTop: '1em' }} />
                                    <Chip label={`Approximately ${eta} remaining`} style={{ marginTop: '1em' }} />
                                </>}
                                {displayableFiles && <Alert severity='info'>
                                    Upload in progress, please do not close the tab or refresh.
                                </Alert>}
                            </>
                        </Stack>
                    </GlassCard>
                </div>
            </div>
            <>
                <div style={{ padding: '0.8em' }} />
                <div style={{ flexGrow: 1, flex: 1 }}>
                    <TableContainer style={width > ScreenWidths.Mobile ? { overflowY: 'scroll', height: '70vh' } : {}}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>File Name</TableCell>
                                    <TableCell>Size</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayableFiles?.map((fileRecord, index) => <Fragment key={index}>
                                    <TableRow >
                                        <TableCell>
                                            {fileRecord.uploadedChucks > 0 && <CircularProgress size={CssSizes.moderate} />}
                                            {fileRecord.file.name}
                                        </TableCell>
                                        <TableCell>{getFileSize(fileRecord.file.size)}</TableCell>
                                    </TableRow>
                                    {fileRecord.uploadedChucks > 0 && <TableRow key={index} >
                                        <TableCell colSpan={2}>
                                            <LinearProgress variant="determinate" value={100 * fileRecord.uploadedChucks / fileRecord.chunks} />
                                        </TableCell>
                                    </TableRow>}
                                </Fragment>)}
                                {!displayableFiles?.length && <TableRow key='empty' >
                                    <TableCell colSpan={2}>
                                        <Alert severity='info'>
                                            Add Files To Start Upload.
                                        </Alert>
                                    </TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </>
        </DynamicStack>
    </Stack>
}

export default Cluster