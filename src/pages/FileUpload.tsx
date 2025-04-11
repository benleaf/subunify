import GlassText from "@/components/glassmorphism/GlassText";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { Button, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
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
import { useNavigate } from "react-router";
import DashboardLayout from "@/components/DashboardLayout";
import DynamicStack from "@/components/glassmorphism/DynamicStack";
import { fileUpload } from "@/api/apiAction";
import ProgressModal from "@/components/modal/ProgressModal";
import { useSize } from "@/hooks/useSize";
import { ScreenWidths } from "@/constants/ScreenWidths";
import BaseModal from "@/components/modal/BaseModal";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SERVER_URL);

const removeDuplicates = (files: File[]) => files.reduce((unique: File[], o) => {
    if (!unique.some(file => file.name === o.name)) {
        unique.push(o);
    }
    return unique;
}, []);

const FileUpload = () => {
    const navigate = useNavigate()
    const { dispatch } = useContext(StateMachineDispatch)!
    const { width } = useSize()

    const [files, setFiles] = useState<File[]>([])
    const totalSize = files.length ? files.map(file => file.size).reduce((acc, cur) => acc + cur) : 0
    const absoluteMonthlyCost = getNumericFileMonthlyCost(totalSize)
    const monthlyCost = absoluteMonthlyCost < 0.01 ? '<$0.01' : `$${absoluteMonthlyCost.toFixed(2)}`
    const [fileProgress, setFileProgress] = useState(0)
    const [s3Progress, setS3Progress] = useState(0)

    const onDrop = useCallback(
        (acceptedFiles: File[]) => setFiles(old => removeDuplicates([...old, ...acceptedFiles])),
        []
    );

    const { authAction, user } = useAuth()
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    const [authFlow, setAuthFlow] = useState('adding')

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
            uploadFile()
        }
    }

    const onPaymentCompleat = () => {
        setAuthFlow('uploading')
        uploadFile()
    }

    useEffect(() => {
        if (user && authFlow == 'login') uploadFlow()
    }, [user])

    const uploadFile = async (): Promise<void> => {
        if (!files.length) return

        const formData = new FormData();
        for (const file of files) {
            formData.append("file", file);
        }

        socket.on('upload-progress', data => setS3Progress(data.progress))

        const result = await fileUpload(
            'storage-file',
            formData,
            progress => setFileProgress(old => old + progress)
        )

        socket.off('upload-progress')

        if (isError(result)) {
            setAuthFlow('adding')
            setFiles([])
            dispatch({
                action: 'popup',
                data: {
                    colour: 'error',
                    message: `Error during upload, some files may not have been uploaded`
                }
            })
            return
        }

        dispatch({ action: 'popup', data: { colour: 'success', message: 'Files Uploaded Successfully!' } })
        navigate('/deep-storage')
    }

    return <DashboardLayout>
        <DynamicStack>
            <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, flex: 1 }}>
                {files.length > 0 &&
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
                        <GlassText size="moderate">Monthly Cost: ${(Math.max(1, getNumericFileMonthlyCost(totalSize))).toFixed(2)}</GlassText>
                        <GlassText size="moderate">Upload Cost: ${(Math.max(0.5, getNumericFileUploadCost(totalSize))).toFixed(2)}</GlassText>
                    </Stack>
                </GlassCard>
            </div>
            {files.length > 0 && <>
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
                                {files.map((file, index) => <TableRow key={index} >
                                    <TableCell>{file.name}</TableCell>
                                    <TableCell>{getFileCost(file.size)}</TableCell>
                                    <TableCell>{getFileSize(file.size)}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => setFiles(old => old.filter((_, innerIndex) => innerIndex != index))}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </>
            }
        </DynamicStack>
        <BaseModal state={authFlow == 'message' ? 'open' : 'closed'} close={() => setAuthFlow('editing')} maxWidth={600}>
            <GlassSpace size='moderate'>
                <GlassText size='large'>File Uploader</GlassText>
                <div style={{ display: "flex", flexWrap: 'wrap', paddingBottom: CssSizes.small }}>
                    <GlassCard marginSize="tiny" paddingSize="small">
                        <GlassText size="moderate">Files to upload: {files.length}</GlassText>
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
                        <GlassText size="moderate">Upload fee: ${(Math.max(0.5, getNumericFileUploadCost(totalSize))).toFixed(2)}</GlassText>
                    </GlassCard>
                    <GlassText size='moderate'>If you are yet to create an account and start a subscription, you will be prompted to do that first</GlassText>
                </div>
                <Button onClick={uploadFlow} fullWidth variant="contained">Upload</Button>
            </GlassSpace>
        </BaseModal>
        <TutorialModal modalName="FileUpload">
            <GlassText size='large'>Select Files For Deep Storage</GlassText>
            <GlassText size='moderate'>Drag files into the file box or click the "Add File" button to stage files for upload</GlassText>
            <GlassText size='moderate'>
                Once you have added all your files, click the upload button, if you are yet to start
                a subscription and create an account you will be prompted to do so at this point.
            </GlassText>
        </TutorialModal>
        <ProgressModal
            progressFile={(fileProgress / totalSize) * 100}
            progressS3={(s3Progress / totalSize) * 100}
        />
        <AuthModal hideButton onClose={() => setAuthFlow('adding')} overrideState={authFlow == 'login'} />
        <PaymentModal
            state={authFlow == 'payment' ? 'open' : 'closed'}
            onComplete={onPaymentCompleat}
            onClose={() => setAuthFlow('adding')}
        />
    </DashboardLayout>
}

export default FileUpload