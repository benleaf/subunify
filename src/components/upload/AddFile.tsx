import { CssSizes } from "@/constants/CssSizes"
import { ScreenWidths } from "@/constants/ScreenWidths"
import { getFileSize, getFileCost, getNumericFileMonthlyCost, getNumericFileUploadCost } from "@/helpers/FileSize"
import { Delete } from "@mui/icons-material"
import { Button, Stack, Divider, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert, Checkbox, FormControlLabel } from "@mui/material"
import DynamicStack from "../glassmorphism/DynamicStack"
import GlassCard from "../glassmorphism/GlassCard"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import FileUploadNebula from "../graphics/FileUploadNebula"
import TutorialModal from "../modal/TutorialModal"
import { getExtension, getTagsFromFile } from "@/helpers/FileProperties"
import { useCallback, useContext, useState } from "react"
import { useDropzone, FileError } from "react-dropzone"
import { StateMachineDispatch } from "@/App"
import { useSize } from "@/hooks/useSize"
import { TaggedFile } from "@/pages/FileUpload"

const BLOCKED_EXTENSIONS = [
    'exe', 'dll', 'com', 'msi', 'bat', 'cmd', 'sh', 'vbs', 'js',
    'ts', 'html', 'htm', 'svg', 'php', 'jsp', 'asp', 'aspx', 'py',
    'pl', 'rb', 'cgi', 'jar', 'apk', 'swf', 'scr', 'wsf', 'ps1'
]

type Props = {
    files: TaggedFile[]
    setFiles: React.Dispatch<React.SetStateAction<TaggedFile[]>>
    done: () => void
}

const AddFile = ({ files, setFiles, done }: Props) => {
    const [uploadFolder, setUploadFolder] = useState(true)
    const { dispatch } = useContext(StateMachineDispatch)!
    const { width } = useSize()

    const totalSize = files.length ? files.map(fileRecord => fileRecord.file.size).reduce((acc, cur) => acc + cur) : 0
    const absoluteMonthlyCost = getNumericFileMonthlyCost(totalSize)
    const absoluteMonthlyCostAfterUpload = Math.max(0.6, absoluteMonthlyCost)

    const monthlyCost = absoluteMonthlyCostAfterUpload <= 0.6 ? '(Less then $0.01)' : `$${absoluteMonthlyCost.toFixed(2)}`
    const uploadFee = (Math.max(0.5, getNumericFileUploadCost(totalSize))).toFixed(2)

    const removeDuplicates = (files: TaggedFile[]) => {
        const duplicatesRemoved = files.reduce((unique: TaggedFile[], o) => {
            if (!unique.some(fileRecord => fileRecord.file.name === o.file.name)) {
                unique.push(o);
            }
            return unique;
        }, [])

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
            dispatch({ action: 'loading', data: false })
            setFiles(old => removeDuplicates([
                ...old,
                ...acceptedFiles.map(file => ({
                    file,
                    tags: getTagsFromFile(file)
                }))
            ]))
        },
        []
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onFileDialogOpen: () => dispatch({ action: 'loading', data: true }),
        validator: file => {
            const ext = getExtension(file)
            if (BLOCKED_EXTENSIONS.includes(ext)) {
                const message = `Files of the following types are not allowed: ${BLOCKED_EXTENSIONS.join(', ')}`
                dispatch({ action: 'popup', data: { colour: 'info', message } })
                return { message, code: 'FileTypeNotAllowed' } as FileError
            }
            return null
        },

    })
    return <>
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
                    <input
                        {...getInputProps()}
                        {...(uploadFolder ? { webkitdirectory: 'true', mozdirectory: 'true', directory: 'true' } : {})}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Button variant="outlined" >
                            {isDragActive ? "Drop Files" : `Add ${uploadFolder ? 'Folder' : 'Files'}`}
                        </Button>
                    </div>
                </div>
                <FormControlLabel
                    label="Upload Entire Folder"
                    control={
                        <Checkbox
                            checked={uploadFolder}
                            onChange={(_, checked) => setUploadFolder(checked)}
                        />
                    }
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <GlassCard marginSize="moderate" paddingSize="moderate" flex={1}>
                        <Stack>
                            <GlassText size="moderate">Upload size: {getFileSize(totalSize)}</GlassText>
                            <Divider style={{ margin: '0.4em' }} />
                            <GlassText size="moderate">Monthly Cost of new files: {monthlyCost}</GlassText>
                            <Divider style={{ margin: '0.4em' }} />
                            <GlassText size="moderate">Upload Fee: ${uploadFee}</GlassText>
                        </Stack>
                    </GlassCard>
                    {files.length > 0 && width > ScreenWidths.Tablet && <GlassSpace size="small">
                        <FileUploadNebula points={Math.min(files.length, 1024)} width={200} />
                    </GlassSpace>}
                </div>
            </div>
            <>
                <div style={{ padding: '0.8em' }} />
                <div style={{ flexGrow: 1, flex: 1 }}>
                    <TableContainer style={width > ScreenWidths.Mobile ? { overflowY: 'scroll', height: '70vh' } : {}}>
                        <Table stickyHeader size="small">
                            <TableHead style={{ backgroundColor: '#777' }}>
                                <TableRow>
                                    <TableCell>File Name</TableCell>
                                    <TableCell>Size</TableCell>
                                    <TableCell>Remove</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {files.map((fileRecord, index) => <>
                                    <TableRow key={index} >
                                        <TableCell>{fileRecord.file.name}</TableCell>
                                        <TableCell>{getFileSize(fileRecord.file.size)}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => setFiles(old => old.filter((_, innerIndex) => innerIndex != index))}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                </>)}
                                {files.length == 0 && <TableRow key='empty' >
                                    <TableCell colSpan={4}>No Files Added</TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {files.length > 0 && width > ScreenWidths.Mobile && <div style={{ marginBottom: CssSizes.small }}>
                        <Button onClick={done} fullWidth variant="contained">Next</Button>
                    </div>}
                </div>
            </>
        </DynamicStack>
        {files.length > 0 && width <= ScreenWidths.Mobile && <div style={{ position: 'sticky', bottom: CssSizes.moderate, left: '100%', zIndex: 100 }}>
            <Button onClick={done} fullWidth variant="contained">Next</Button>
        </div>}
    </>
}

export default AddFile