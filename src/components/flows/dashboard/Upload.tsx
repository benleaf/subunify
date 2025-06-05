import { isError } from "@/api/isError"
import { StateMachineDispatch } from "@/App"
import DynamicStack from "@/components/glassmorphism/DynamicStack"
import GlassCard from "@/components/glassmorphism/GlassCard"
import GlassText from "@/components/glassmorphism/GlassText"
import { CssSizes } from "@/constants/CssSizes"
import { ScreenWidths } from "@/constants/ScreenWidths"
import { useAuth } from "@/contexts/AuthContext"
import { useDashboard } from "@/contexts/DashboardContext"
import { getTagsFromFile, getFileExtension } from "@/helpers/FileProperties"
import { getFileSize, terabytesToBytes } from "@/helpers/FileSize"
import { Time } from "@/helpers/Time"
import UploadManager, { FileRecord } from "@/helpers/UploadManager"
import { useSize } from "@/hooks/useSize"
import { TaggedFile } from "@/pages/FileUpload"
import { ProjectResult } from "@/types/server/ProjectResult"
import { ArrowCircleLeft, Delete } from "@mui/icons-material"
import { Stack, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, Chip, CircularProgress, LinearProgress, Divider } from "@mui/material"
import moment, { Moment } from "moment"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useDropzone, FileError } from "react-dropzone"

const BLOCKED_EXTENSIONS = [
    'exe', 'dll', 'com', 'msi', 'bat', 'cmd', 'sh', 'vbs', 'js',
    'ts', 'html', 'htm', 'svg', 'php', 'jsp', 'asp', 'aspx', 'py',
    'pl', 'rb', 'cgi', 'jar', 'apk', 'swf', 'scr', 'wsf', 'ps1'
]

const Cluster = () => {
    const [taggedFiles, setTaggedFiles] = useState<TaggedFile[]>([])
    const { properties, updateProperties, loadProject } = useDashboard()
    const { dispatch } = useContext(StateMachineDispatch)!
    const { width } = useSize()

    const totalBytesUploaded = properties.selectedProject?.files
        .filter(file => file.created)
        .reduce((n, { bytes }) => n + +bytes, 0) ?? 0

    useEffect(() => {
        loadProject()
    }, [])

    const totalSize = taggedFiles.length ? taggedFiles.map(fileRecord => fileRecord.file.size).reduce((acc, cur) => acc + cur) : 0

    const removeDuplicates = (files: TaggedFile[], availableTBs: number) => {
        const duplicatesRemoved = files.reduce((unique: TaggedFile[], o) => {
            if (!unique.some(fileRecord => fileRecord.file.name === o.file.name)) {
                unique.push(o);
            }
            return unique;
        }, [])

        const totalBytes = files.reduce((n, { file }) => n + +file.size, 0) ?? 0
        console.log(getFileSize(totalBytesUploaded + totalBytes), availableTBs)
        if (totalBytesUploaded + totalBytes > terabytesToBytes(availableTBs)) {
            const missing = getFileSize((totalBytesUploaded + totalBytes) - terabytesToBytes(availableTBs))
            dispatch({
                action: 'popup',
                data: { colour: 'info', message: `Please add more storage to this project, missing: ${missing}` }
            })
            return []
        }

        if (duplicatesRemoved.length !== files.length) {
            dispatch({
                action: 'popup',
                data: { colour: 'info', message: 'Duplicate files detected and removed, file names must be unique' }
            })
        }

        return duplicatesRemoved
    }

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setTaggedFiles(old => removeDuplicates([
                ...old,
                ...acceptedFiles.map(file => ({
                    file,
                    tags: getTagsFromFile(file)
                }))
            ], properties.selectedProject?.availableTBs ?? 0))
        },
        [properties.selectedProject?.availableTBs]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        validator: file => {
            const ext = getFileExtension(file)
            if (BLOCKED_EXTENSIONS.includes(ext)) {
                const message = `Files of the following types are not allowed: ${BLOCKED_EXTENSIONS.join(', ')}`
                // dispatch({ action: 'popup', data: { colour: 'info', message } })
                return { message, code: 'FileTypeNotAllowed' } as FileError
            }
            return null
        },

    })

    ////////////////////////////////////////////////////////

    const fileRecords: FileRecord[] = taggedFiles.map(file => ({
        description: 'not set',
        file: file.file,
        projectId: properties.selectedProjectId!,
    }))

    const { authAction } = useAuth()

    const [totalUploaded, setTotalUploaded] = useState(0)
    const [startTime, setStartTime] = useState<Moment>()
    const [eta, setEta] = useState<string>()
    const [mbps, setMbps] = useState<number>()

    const totalProgress = (totalUploaded / totalSize) * 100
    const uploadManagerRef = useRef<UploadManager>()

    useEffect(() => {
        if (totalUploaded === 0 || !startTime) return
        const now = moment()
        const duration = moment.duration(now.diff(startTime))
        const secondsElapsed = duration.asSeconds()
        const uploadSpeed = totalUploaded / secondsElapsed
        setMbps((uploadSpeed * 8) / 1024 / 1024)
        const remainingBytes = totalSize - totalUploaded
        const estimatedSecondsLeft = remainingBytes / uploadSpeed
        setEta(Time.formatDate(moment().add(estimatedSecondsLeft, 'seconds')))
    }, [totalProgress])

    const onComplete = () => {
        console.log("Upload complete")
    }

    const onFileUploadFinished = (fileName: string) => {
        setTaggedFiles(old => old.filter(file => file.file.name != fileName))
        dispatch({
            action: 'popup',
            data: { colour: 'info', message: `${fileName} uploaded` }
        })
    }

    useEffect(() => {
        if (uploadManagerRef.current?.isRunning) {
            uploadManagerRef.current?.update(fileRecords)
        } else if (fileRecords.length) {
            setStartTime(moment())
            console.log("Starting upload manager")
            uploadManagerRef.current = new UploadManager(
                authAction,
                setTotalUploaded,
                onComplete,
                onFileUploadFinished
            )
            uploadManagerRef.current.start(fileRecords)
        }
    }, [taggedFiles])

    useEffect(() => {
        if (uploadManagerRef.current?.isRunning) {
            uploadManagerRef.current?.setConcurrentUploads(mbps ?? 30)
        }
    }, [mbps])

    useEffect(() => {
        const abortController = new AbortController()

        return () => {
            console.log("Cleaning up AuthContext");
            uploadManagerRef.current?.cancel()
            abortController.abort()
        };
    }, [])

    return <Stack spacing={1}>
        <Stack spacing={1}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                <div
                    {...getRootProps()}
                    style={{
                        border: '1px dashed gray',
                        textAlign: 'center',
                        cursor: 'pointer',
                        margin: '0.2em',
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 300,
                        flex: 1
                    }}
                >
                    <input {...getInputProps()} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Button variant="outlined" >
                            {isDragActive ? "Drop Files" : `Add Files`}
                        </Button>
                    </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <GlassCard marginSize="moderate" paddingSize="moderate" flex={1}>
                        <Stack spacing={2}>
                            {totalProgress < 100 && <>
                                <GlassText size="moderate">
                                    <CircularProgress size={CssSizes.moderate} /> Total Progress
                                </GlassText>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <LinearProgress value={totalProgress} variant="determinate" style={{ flex: 1 }} />
                                    <GlassText size="moderate">
                                        {totalProgress.toFixed(1)}%
                                    </GlassText>
                                </Stack>
                                {mbps && <Chip label={`${mbps.toFixed(1)} Mbps`} style={{ marginTop: '1em' }} />}
                                {eta && <Chip label={`Approximately ${eta} remaining`} style={{ marginTop: '1em' }} />}
                                <Alert severity='info'>
                                    Upload in progress, please do not close the tab or refresh.
                                </Alert>
                            </>}
                        </Stack>
                        {totalProgress == 100 && <>
                            <CircularProgress />
                        </>}
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
                                    <TableCell>Remove</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {taggedFiles.map((fileRecord, index) => <>
                                    <TableRow key={index} >
                                        <TableCell>{fileRecord.file.name}</TableCell>
                                        <TableCell>{getFileSize(fileRecord.file.size)}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => setTaggedFiles(old => old.filter((_, innerIndex) => innerIndex != index))}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                </>)}
                                {taggedFiles.length == 0 && <TableRow key='empty' >
                                    <TableCell colSpan={4}>No Files Added</TableCell>
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