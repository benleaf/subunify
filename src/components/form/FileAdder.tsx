import { useAuth } from "@/contexts/AuthContext";
import { getFileExtension } from "@/helpers/FileProperties";
import { getFileSize, terabytesToBytes } from "@/helpers/FileSize";
import { Button } from "@mui/material";
import { useCallback } from "react";
import { useDropzone, FileError } from "react-dropzone";

type Props = {
    totalBytesUploaded: number,
    availableTBs?: number,
    setFiles: (file: File[]) => void
}

const BLOCKED_EXTENSIONS = [
    'exe', 'dll', 'com', 'msi', 'bat', 'cmd', 'sh', 'vbs', 'js',
    'ts', 'html', 'htm', 'svg', 'php', 'jsp', 'asp', 'aspx', 'py',
    'pl', 'rb', 'cgi', 'jar', 'apk', 'swf', 'scr', 'wsf', 'ps1'
]

const FileAdder = ({ totalBytesUploaded, availableTBs, setFiles: setFiles }: Props) => {
    const { setAlert } = useAuth()

    const removeDuplicates = (files: File[], availableTBs: number) => {
        const duplicatesRemoved = files.reduce((unique: File[], o) => {
            if (!unique.some(fileRecord => fileRecord.name === o.name)) {
                unique.push(o);
            }
            return unique;
        }, [])

        const totalBytes = files.reduce((n, file) => n + +file.size, 0) ?? 0
        console.log(getFileSize(totalBytesUploaded + totalBytes), availableTBs)
        if (totalBytesUploaded + totalBytes > terabytesToBytes(availableTBs)) {
            const missing = getFileSize((totalBytesUploaded + totalBytes) - terabytesToBytes(availableTBs))
            setAlert(`Please add more storage to this project, missing: ${missing}`, 'info')
            return []
        }

        if (duplicatesRemoved.length !== files.length) {
            setAlert('Duplicate files detected and removed, file names must be unique', 'info')
        }

        return duplicatesRemoved
    }

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setFiles(removeDuplicates(acceptedFiles, availableTBs ?? 0))
        },
        [availableTBs]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        validator: file => {
            const ext = getFileExtension(file)
            if (BLOCKED_EXTENSIONS.includes(ext)) {
                const message = `Files of the following types are not allowed: ${BLOCKED_EXTENSIONS.join(', ')}`
                setAlert(message, 'info')
                return { message, code: 'FileTypeNotAllowed' } as FileError
            }
            return null
        },

    })
    return <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, flex: 1 }}>
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
    </div>
}

export default FileAdder