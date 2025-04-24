import GlassText from "@/components/glassmorphism/GlassText";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { Alert, Button, Divider, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { useCallback } from 'react';
import { useDropzone, FileError } from 'react-dropzone';
import { getFileCost, getFileSize, getNumericFileMonthlyCost, getNumericFileUploadCost } from "@/helpers/FileSize";
import { Delete, Edit } from "@mui/icons-material";
import { CssSizes } from "@/constants/CssSizes";
import TutorialModal from "@/components/modal/TutorialModal";
import { User } from "@/types/User";
import { isError } from "@/api/isError";
import { StateMachineDispatch } from "@/App";
import AuthModal from "@/auth/AuthModal";
import PaymentModal from "@/components/modal/PaymentModal";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DynamicStack from "@/components/glassmorphism/DynamicStack";
import { useSize } from "@/hooks/useSize";
import { ScreenWidths } from "@/constants/ScreenWidths";
import BaseModal from "@/components/modal/BaseModal";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import FileUploadModal from "@/components/modal/FileUploadModal";

type FileRecord = { file: File, description: string, finishEdit: boolean }

const BLOCKED_EXTENSIONS = [
    'exe', 'dll', 'com', 'msi', 'bat', 'cmd', 'sh', 'vbs', 'js',
    'ts', 'html', 'htm', 'svg', 'php', 'jsp', 'asp', 'aspx', 'py',
    'pl', 'rb', 'cgi', 'jar', 'apk', 'swf', 'scr', 'wsf', 'ps1'
]

const FileUpload = () => {
    const maxDescriptionLength = 5000
    const { dispatch } = useContext(StateMachineDispatch)!
    const { width } = useSize()

    const { authAction, user } = useAuth()
    const [authFlow, setAuthFlow] = useState('adding')
    const [userCurrentBytes, setUserCurrentBytes] = useState(0)

    const [startUpload, setStartUpload] = useState(false)
    const [fileRecords, setFileRecords] = useState<FileRecord[]>([])

    const totalSize = fileRecords.length ? fileRecords.map(fileRecord => fileRecord.file.size).reduce((acc, cur) => acc + cur) : 0
    const absoluteMonthlyCost = getNumericFileMonthlyCost(totalSize)
    const userCurrentMonthlyCost = getNumericFileMonthlyCost(userCurrentBytes)
    const absoluteMonthlyCostAfterUpload = Math.max(0.6, absoluteMonthlyCost + userCurrentMonthlyCost)

    const monthlyCost = absoluteMonthlyCostAfterUpload <= 0.6 ? '$0.00' : `$${absoluteMonthlyCost.toFixed(2)}`
    const monthlyCostAfterUpload = `$${absoluteMonthlyCostAfterUpload.toFixed(2)}`
    const uploadFee = (Math.max(0.5, getNumericFileUploadCost(totalSize))).toFixed(2)

    const removeDuplicates = (fileRecords: FileRecord[]) => {
        const duplicatesRemoved = fileRecords.reduce((unique: FileRecord[], o) => {
            if (!unique.some(fileRecord => fileRecord.file.name === o.file.name)) {
                unique.push(o);
            }
            return unique;
        }, [])

        if (duplicatesRemoved.length !== fileRecords.length) {
            dispatch({
                action: 'popup',
                data: { colour: 'warning', message: 'Duplicate files detected and removed, file names must be unique' }
            })
        }

        return duplicatesRemoved
    }

    const onDrop = useCallback(
        (acceptedFiles: File[]) => setFileRecords(old => removeDuplicates([
            ...old,
            ...acceptedFiles.map(file => ({ file, description: '', finishEdit: false }))
        ])),
        []
    )
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        validator: file => {
            const ext = file.name.split('.').pop()!
            if (BLOCKED_EXTENSIONS.includes(ext)) {
                const message = `Files of the following types are not allowed: ${BLOCKED_EXTENSIONS.join(', ')}`
                dispatch({ action: 'popup', data: { colour: 'warning', message } })
                return { message, code: 'FileTypeNotAllowed' } as FileError
            }
            return null
        }
    })

    const uploadFlow = async () => {
        setAuthFlow('adding')
        if (!user) {
            return setAuthFlow('login')
        }

        const userResult = await authAction<User>(`user`, "GET")

        if ((isError(userResult) && userResult.error == 'UserNotSubscribed')) {
            setAuthFlow('payment')
        } else if (isError(userResult)) {
            dispatch({
                action: 'popup',
                data: { colour: 'error', message: userResult.message ?? 'Failed to find user' }
            })
        } else if (userResult?.stripeSubscriptionId === null) {
            setAuthFlow('payment')
        } else {
            setStartUpload(true)
        }
    }

    const onPaymentCompleat = () => {
        setAuthFlow('uploading')
        setStartUpload(true)
    }

    const updateFileDescription = (fileName: string, text: string) => {
        const limitedText = text.slice(0, maxDescriptionLength)
        setFileRecords(old => old.map(fr =>
            fr.file.name === fileName ? { ...fr, description: limitedText } : fr
        ))
    }

    const setFinishEdit = (fileName: string, state: boolean) => {
        setFileRecords(old => old.map(fr =>
            fr.file.name === fileName ? { ...fr, finishEdit: state } : fr
        ))
    }

    useEffect(() => {
        if (user && authFlow == 'login') uploadFlow()

        const getUserBytes = async () => {
            const result = await authAction<{ bytes: number }>(`storage-file/user-bytes`, "GET");
            if (!isError(result)) {
                setUserCurrentBytes(result.bytes)
            }
        }

        if (user) getUserBytes()
    }, [user])


    return <DashboardLayout>
        <DynamicStack>
            <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, flex: 1 }}>
                {fileRecords.length > 0 &&
                    <div style={{ marginBottom: CssSizes.small }}>
                        <Button onClick={() => setAuthFlow('message')} fullWidth variant="contained">Upload Files</Button>
                    </div>
                }
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
                    <div>
                        <Button variant="outlined" >
                            {isDragActive ? "Drop FILE" : "Add Files"}
                        </Button>
                    </div>
                </div>
                <GlassCard marginSize="moderate" paddingSize="moderate">
                    <Stack >
                        <GlassText size="moderate">Upload size: {getFileSize(totalSize)}</GlassText>
                        <GlassText size="moderate">Total store size after upload: {getFileSize(userCurrentBytes + totalSize)}</GlassText>
                        <Divider style={{ margin: '0.4em' }} />
                        <GlassText size="moderate">Monthly Cost of new files: {monthlyCost}</GlassText>
                        <GlassText size="moderate">Monthly Cost after upload: {monthlyCostAfterUpload}</GlassText>
                        <Divider style={{ margin: '0.4em' }} />
                        <GlassText size="moderate">Upload Fee: ${uploadFee}</GlassText>
                    </Stack>
                </GlassCard>
            </div>
            {fileRecords.length > 0 && <>
                <div style={{ padding: '0.8em' }} />
                <div style={{ flexGrow: 1, flex: 1 }}>
                    <TableContainer style={width > ScreenWidths.Mobile ? { overflowY: 'scroll', height: '85vh' } : {}}>
                        <Table stickyHeader size="small">
                            <TableHead style={{ backgroundColor: '#777' }}>
                                <TableRow>
                                    <TableCell>File Name</TableCell>
                                    <TableCell>Cost Per Month</TableCell>
                                    <TableCell>Size</TableCell>
                                    <TableCell>Remove</TableCell>
                                    <TableCell>Edit</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fileRecords.map((fileRecord, index) => <>
                                    <TableRow key={index} >
                                        <TableCell>{fileRecord.file.name}</TableCell>
                                        <TableCell>{getFileCost(fileRecord.file.size)}</TableCell>
                                        <TableCell>{getFileSize(fileRecord.file.size)}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => setFileRecords(old => old.filter((_, innerIndex) => innerIndex != index))}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => setFinishEdit(fileRecord.file.name, false)}>
                                                <Edit />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    {!fileRecord.finishEdit && <TableRow key={`${index}-description`} >
                                        <TableCell colSpan={5} style={{ padding: CssSizes.moderate }}>
                                            <TextField
                                                variant="filled"
                                                multiline
                                                minRows={2}
                                                value={fileRecord.description}
                                                error={fileRecord.description.length >= maxDescriptionLength}
                                                fullWidth
                                                label={`Description for "${fileRecord.file.name}"`}
                                                onChange={e => updateFileDescription(fileRecord.file.name, e.target.value)}
                                            />
                                            <Button onClick={() => setFinishEdit(fileRecord.file.name, true)} fullWidth variant="outlined">Done</Button>
                                        </TableCell>
                                    </TableRow>}
                                </>)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </>
            }
        </DynamicStack>
        <BaseModal state={authFlow == 'message' ? 'open' : 'closed'} close={() => setAuthFlow('editing')} maxWidth={600}>
            <GlassSpace size='moderate'>
                <Stack spacing={1}>
                    <GlassText size='large'>File Uploader</GlassText>
                    <div style={{ display: "flex", flexWrap: 'wrap', paddingBottom: CssSizes.small }}>
                        <GlassCard marginSize="tiny" paddingSize="small">
                            <GlassText size="moderate">Files to upload: {fileRecords.length}</GlassText>
                        </GlassCard>
                        <GlassCard marginSize="tiny" paddingSize="small">
                            <GlassText size="moderate">Size: {getFileSize(totalSize)}</GlassText>
                        </GlassCard>
                        <GlassCard marginSize="tiny" paddingSize="small">
                            <GlassText size="moderate"> Monthly cost for new files: {monthlyCost}</GlassText>
                        </GlassCard>
                        <GlassCard marginSize="tiny" paddingSize="small">
                            <GlassText size="moderate">Upload fee: ${uploadFee}</GlassText>
                        </GlassCard>
                        <GlassCard marginSize="tiny" paddingSize="small">
                            <GlassText size="moderate">New monthly cost: {monthlyCostAfterUpload}</GlassText>
                        </GlassCard>
                    </div>
                    <GlassText size='moderate'>If you are yet to create an account and start a subscription, you will be prompted to do that first</GlassText>
                    <Alert severity='warning' sx={{ width: '100%' }}>
                        The upload fee will be charged immediately upon upload
                    </Alert>
                    <Button onClick={uploadFlow} fullWidth variant="contained">Upload</Button>
                    <Divider orientation="horizontal" style={{ marginBlock: CssSizes.moderate }}></Divider>
                    <GlassText size="small" >
                        See our <a href="/terms-of-service">Terms of Service</a> and our <a href="/privacy-policy">Privacy Policy</a> before uploading.
                    </GlassText>
                </Stack>
            </GlassSpace>
        </BaseModal>
        <TutorialModal modalName="FileUpload">
            <GlassText size='large'>Select Files For Deep Storage</GlassText>
            <GlassText size='moderate'>Click the "Add File" button to stage files for upload</GlassText>
            <GlassText size='moderate'>
                Once you have added all your files, click the upload button, if you are yet to start
                a subscription and create an account you will be prompted to do so at this point.
            </GlassText>
            <Alert severity='warning' sx={{ width: '100%' }}>
                Files in deep storage can't be previewed, ensure you add meaningful descriptions
            </Alert>
        </TutorialModal>
        <FileUploadModal fileRecords={fileRecords} startUpload={startUpload} />
        <AuthModal hideButton onClose={() => setAuthFlow('adding')} overrideState={authFlow == 'login'} />
        <PaymentModal
            state={authFlow == 'payment' ? 'open' : 'closed'}
            onComplete={onPaymentCompleat}
            onClose={() => setAuthFlow('adding')}
        />
    </DashboardLayout>
}

export default FileUpload