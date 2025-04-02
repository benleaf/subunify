import GlassText from "@/components/glassmorphism/GlassText";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { ComponentSizes } from "@/constants/ComponentSizes";
import { useSize } from "@/hooks/useSize";
import { Button, Divider, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { getFileCost, getFileSize, getNumericFileCost } from "@/helpers/FileSize";
import { Delete } from "@mui/icons-material";
import { CssSizes } from "@/constants/CssSizes";
import TutorialModal from "@/components/modal/TutorialModal";
import { User } from "@/types/User";
import { isError } from "@/api/isError";
import { StateMachineDispatch } from "@/App";
import AuthModal from "@/auth/AuthModal";
import PaymentModal from "@/components/payments/PaymentModal";

const FileUpload = () => {
    const { dispatch } = useContext(StateMachineDispatch)!

    const [files, setFiles] = useState<File[]>([])
    const onDrop = useCallback(
        (acceptedFiles: File[]) => setFiles(old => [...old, ...acceptedFiles]),
        []
    );

    const { height, width } = useSize()
    const { authAction, user } = useAuth()
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    const [authFlow, setAuthFlow] = useState('adding')

    const uploadFlow = async () => {
        setAuthFlow('adding')
        if (!user) {
            return setAuthFlow('login')
        }
        const userResult = await authAction<User>(`user`, "GET")
        if (isError(userResult)) {
            console.error(userResult)
            dispatch({ action: 'popup', data: { colour: 'error', message: 'Failed to find user' } })
        }

        uploadFile()
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
        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);
            const result = await authAction('storage-file', 'POST', formData)

            if (isError(result) && result.error == 'UserNotSubscribed') {
                setAuthFlow('payment')
                return
            }
        }
    }

    const totalSize = files.length ? files.map(file => file.size).reduce((acc, cur) => acc + cur) : 0

    return <div style={{ display: 'flex' }}>
        <div style={{ height: height - ComponentSizes.topBar, width: width }}>
            <GlassCard marginSize="moderate" paddingSize="moderate" height={(height - ComponentSizes.topBar) - 45}>
                <div style={{ height: "100%", display: 'flex', flexDirection: 'column' }}>
                    <GlassText size='large'>Deep Store File Upload</GlassText>
                    <div
                        {...getRootProps()}
                        style={{
                            border: '1px dashed gray',
                            textAlign: 'center',
                            cursor: 'pointer',
                            margin: 10,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: 300
                        }}
                    >
                        <input {...getInputProps()} />
                        <div>
                            <Button
                                variant={isDragActive || files.length > 0 ? "outlined" : "contained"}
                            >
                                {isDragActive ? "Drop FILE" : "Add Files"}
                            </Button>
                        </div>
                    </div>
                    <GlassCard marginSize="moderate" paddingSize="moderate">
                        <Stack direction='row' spacing={5} >
                            <Stack >
                                <GlassText size="moderate">Total size: {getFileSize(totalSize)}</GlassText>
                                <GlassText size="moderate">(Monthly) Data Cost: {getFileCost(totalSize)}</GlassText>
                                <GlassText size="moderate">(Monthly) Base Cost: $1.00</GlassText>
                                <GlassText size="moderate">(Monthly) Total Cost: ${(getNumericFileCost(totalSize) + 1).toFixed(2)}</GlassText>
                            </Stack>
                            <Stack >
                                <GlassText size="moderate">File Access Cost: $0.1/GB</GlassText>
                                <GlassText size="moderate">Access Time: 12Hrs</GlassText>
                                <GlassText size="moderate">Minimum File Storage Time: 6 Months</GlassText>
                                <GlassText size="moderate">Access Requests Per File Per Year: 2</GlassText>
                            </Stack>
                        </Stack>
                        <Divider flexItem sx={{ margin: CssSizes.small }} />
                        {files.length > 0 &&
                            <Button onClick={uploadFlow} fullWidth variant="contained">Upload Files</Button>
                        }
                    </GlassCard>
                    {files.length > 0 &&
                        <div style={{ flexGrow: 1 }}>
                            <TableContainer component={Paper}>
                                <Table stickyHeader size="small">
                                    <TableHead>
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
                    }
                </div>
            </GlassCard>
        </div>
        <TutorialModal modalName="FileUpload">
            <GlassText size='large'>Select Files For Deep Storage</GlassText>
            <GlassText size='moderate'>Drag files into the file box or click the "Add File" button to stage files for upload</GlassText>
        </TutorialModal>
        <AuthModal hideButton onClose={uploadFlow} overrideState={authFlow == 'login'} />
        <PaymentModal
            state={authFlow == 'payment' ? 'open' : 'closed'}
            onComplete={onPaymentCompleat}
            onClose={() => setAuthFlow('adding')}
        />
    </div >
}

export default FileUpload