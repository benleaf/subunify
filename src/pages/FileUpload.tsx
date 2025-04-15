import GlassText from "@/components/glassmorphism/GlassText";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { Alert, Button, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { getFileCost, getFileSize, getNumericFileMonthlyCost, getNumericFileUploadCost } from "@/helpers/FileSize";
import { Delete } from "@mui/icons-material";
import { CssSizes } from "@/constants/CssSizes";
import TutorialModal from "@/components/modal/TutorialModal";
import { User } from "@/types/User";
import { isError } from "@/api/isError";
import { StateMachineDispatch } from "@/App";
import AuthModal from "@/auth/AuthModal";
import PaymentModal from "@/components/modal/PaymentModal";
import DashboardLayout from "@/components/DashboardLayout";
import DynamicStack from "@/components/glassmorphism/DynamicStack";
import { useSize } from "@/hooks/useSize";
import { ScreenWidths } from "@/constants/ScreenWidths";
import BaseModal from "@/components/modal/BaseModal";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import FileUploadModal from "@/components/modal/FileUploadModal";

type FileRecord = { file: File, description: string }

const FileUpload = () => {
    const maxDescriptionLength = 5000
    const { dispatch } = useContext(StateMachineDispatch)!
    const { width } = useSize()

    const { authAction, user } = useAuth()
    const [authFlow, setAuthFlow] = useState('adding')

    const [startUpload, setStartUpload] = useState(false)
    const [fileRecords, setFileRecords] = useState<FileRecord[]>([])

    const totalSize = fileRecords.length ? fileRecords.map(fileRecord => fileRecord.file.size).reduce((acc, cur) => acc + cur) : 0
    const absoluteMonthlyCost = getNumericFileMonthlyCost(totalSize)
    const monthlyCost = absoluteMonthlyCost < 0.01 ? '<$0.01' : `$${absoluteMonthlyCost.toFixed(2)}`
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
            ...acceptedFiles.map(file => ({ file, description: '' }))
        ])),
        []
    )
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

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
        console.log(limitedText)
        setFileRecords(old => old.map(fr =>
            fr.file.name === fileName ? { ...fr, description: limitedText } : fr
        ))
    }

    useEffect(() => {
        if (user && authFlow == 'login') uploadFlow()
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
                        <GlassText size="moderate">Total size: {getFileSize(totalSize)}</GlassText>
                        <GlassText size="moderate">Monthly Cost of new files: {monthlyCost}</GlassText>
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
                                    </TableRow>
                                    <TableRow key={`${index}-description`} >
                                        <TableCell colSpan={4}>
                                            <TextField
                                                style={{ marginBlock: CssSizes.moderate }}
                                                variant="filled"
                                                multiline
                                                minRows={2}
                                                value={fileRecord.description}
                                                error={fileRecord.description.length >= maxDescriptionLength}
                                                fullWidth
                                                label={`Description for "${fileRecord.file.name}"`}
                                                onChange={e => updateFileDescription(fileRecord.file.name, e.target.value)}
                                            />
                                        </TableCell>
                                    </TableRow>
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
                            <GlassText size="moderate">Total size: {getFileSize(totalSize)}</GlassText>
                        </GlassCard>
                        <GlassCard marginSize="tiny" paddingSize="small">
                            <GlassText size="moderate">
                                Monthly cost for new files: {monthlyCost}
                            </GlassText>
                        </GlassCard>
                        <GlassCard marginSize="tiny" paddingSize="small">
                            <GlassText size="moderate">
                                Monthly account fee: $0.60
                            </GlassText>
                        </GlassCard>
                        <GlassCard marginSize="tiny" paddingSize="small">
                            <GlassText size="moderate">Upload fee: ${uploadFee}</GlassText>
                        </GlassCard>

                    </div>
                    <GlassText size='moderate'>If you are yet to create an account and start a subscription, you will be prompted to do that first</GlassText>
                    <Alert severity='warning' sx={{ width: '100%' }}>
                        The upload fee will be charged immediately upon upload
                    </Alert>
                    <Button onClick={uploadFlow} fullWidth variant="contained">Upload</Button>
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