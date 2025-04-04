import GlassText from "@/components/glassmorphism/GlassText";
import EditableTable from "@/components/TablesDataTable/EditableTable";
import { GridColDef, GridRowModel } from "@mui/x-data-grid";
import { useAuth } from "@/auth/AuthContext";
import { useContext, useEffect, useState } from "react";
import { isError } from "@/api/isError";
import moment from "moment";
import { StateMachineDispatch } from "@/App";
import { Button, MenuItem, Select, Stack, TextField } from "@mui/material";
import BaseModal from "@/components/modal/BaseModal";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import { Download } from "@mui/icons-material";
import DashboardLayout from "@/components/DashboardLayout";

const retrievalTypeInfo = {
    Standard: { name: "Standard: 12 hour retrieval", cost: 0.1 },
    Economy: { name: "Economy: 48 hour retrieval", cost: 0.01 },
}

const costPerDay = 0.002

type RetrievalType = keyof typeof retrievalTypeInfo

const retrievalTypes = Object.keys(retrievalTypeInfo) as (keyof typeof retrievalTypeInfo)[]

const DeepStorage = () => {
    const context = useContext(StateMachineDispatch)!
    const [deepStorageFiles, setDeepStorageFiles] = useState<any[]>([])
    const [requestFileModal, setRequestFileModal] = useState({
        state: 'closed',
        retrievalType: 'Standard' as RetrievalType,
        duration: 7,
        fileId: ""
    })

    const { authAction, rawAuthAction } = useAuth()

    useEffect(() => {
        getFiles()
    }, [])

    const getFiles = async () => {
        const files = await authAction<TODO>('storage-file', 'GET')

        if (isError(files)) {

        } else {
            setDeepStorageFiles(files)
        }
    }

    const selectedFile = deepStorageFiles.find(file => file.id == requestFileModal.fileId)
    const selectedFileGB = (selectedFile?.bytes ?? 0) * 1e-9
    const costOfRetrieval = selectedFileGB * retrievalTypeInfo[requestFileModal.retrievalType].cost + selectedFileGB * costPerDay * requestFileModal.duration

    const onDelete = async (id: string) => {
        const record = deepStorageFiles.find(file => file.id == id)
        if (moment(record.dateOfStorage).isAfter(moment().subtract(180, 'days'))) {
            context.dispatch({ action: 'popup', data: { colour: 'warning', message: 'Cannot delete files uploaded within 180 days' } })
            return
        }
        await authAction<TODO>(`storage-file/${id}`, 'DELETE')
        setDeepStorageFiles(oldFiles => oldFiles.filter(file => file.id != id))
    }

    const onUpdate = async (params: GridRowModel) => {
        const updatedFile = await authAction<TODO>(
            `storage-file/${params.id}`,
            'PATCH',
            JSON.stringify({
                description: params.description
            })
        )
        if (isError(updatedFile)) {
            context.dispatch({ action: 'popup', data: { colour: 'error', message: 'Unable to request access to file' } })
            console.log(updatedFile)
            return deepStorageFiles.find(file => file.id == params.id)
        } else {
            return params
        }
    }

    const onRequestAccess = async (id: string, retrievalType: RetrievalType, retrievalDays: number) => {
        const updatedFile = await authAction<TODO>(
            `storage-file/request-restore/${id}`,
            'POST',
            JSON.stringify({
                retrievalType,
                retrievalDays,
            })
        )
        if (isError(updatedFile)) {
            context.dispatch({ action: 'popup', data: { colour: 'error', message: 'Unable to request access to file' } })
            console.log(updatedFile)
        } else {
            setDeepStorageFiles(oldFiles => oldFiles.map(
                file => file.id == id ?
                    { ...file, dateOfLastRestore: updatedFile.lastFileRestore, state: updatedFile.state } :
                    file
            ))
            context.dispatch({ action: 'popup', data: { colour: 'success', message: 'File Requested' } })
            setRequestFileModal(old => ({ ...old, state: 'closed' }))
        }
    }

    const onDownload = async (id: string) => {
        const updatedFile = await rawAuthAction(`storage-file/download/${id}`, 'GET')
        const record = deepStorageFiles.find(file => file.id == id)

        if (isError(updatedFile)) {
            context.dispatch({ action: 'popup', data: { colour: 'error', message: 'Unable to request access to file' } })
            console.log(updatedFile)
            return
        }

        if (!updatedFile.ok) {
            context.dispatch({ action: 'popup', data: { colour: 'warning', message: 'File is still being restored' } })
            return
        }

        const blob = await updatedFile.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = record.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        context.dispatch({ action: 'popup', data: { colour: 'success', message: 'File downloaded!' } })
    }

    const getAccessButton = (id: string, state: string | null) => {
        if (state?.includes('DEEP STORAGE')) {
            return <Button
                variant="outlined"
                onClick={() => setRequestFileModal(old => ({ ...old, state: 'open', fileId: id }))}
            >
                Request Access
            </Button>
        } else if (state?.includes('DOWNLOADABLE')) {
            return <Button variant="outlined" startIcon={<Download />} onClick={() => onDownload(id as string)}>
                Download
            </Button>
        }
        return <></>
    }

    const columns: GridColDef[] = [
        {
            field: 'access',
            type: 'actions',
            editable: false,
            headerName: 'Access',
            width: 120,
            getActions: ({ id, row }) => [getAccessButton(id as string, row.state)]
        },
        {
            field: 'name',
            type: 'string',
            headerName: 'Name',
            editable: false
        },
        {
            field: 'description',
            type: 'string',
            width: 400,
            headerName: 'Description',
            editable: true
        },
        {
            field: 'state',
            type: 'string',
            width: 400,
            headerName: 'State',
            editable: false
        },
        {
            field: 'dateOfStorage',
            type: 'date',
            headerName: 'Date Stored',
            editable: false
        },
        {
            field: 'fileSize',
            type: 'string',
            headerName: 'Size',
            editable: false
        },
    ]

    return <DashboardLayout>
        <GlassText size='large'>DEEP STORE</GlassText>
        <EditableTable
            defaultDensity="standard"
            columns={columns}
            rows={deepStorageFiles}
            deleteRecord={onDelete}
            processRowUpdate={onUpdate} />
        <BaseModal state={requestFileModal.state as any} close={() => setRequestFileModal(old => ({ ...old, state: 'closed' }))}>
            <GlassSpace size="large">
                <Stack spacing={2}>
                    <GlassText size="large">Create Download Window</GlassText>
                    <GlassText size="small">{selectedFile?.name}</GlassText>
                    <GlassText size="moderate">Create a window of time (Following retrieval) where your files can be freely downloaded</GlassText>
                    <Select
                        defaultValue={requestFileModal.retrievalType}
                        onChange={e => setRequestFileModal(old => ({ ...old, retrievalType: e.target.value as RetrievalType }))}
                    >
                        {retrievalTypes.map(type => <MenuItem value={type}>{retrievalTypeInfo[type].name}</MenuItem>)}
                    </Select>
                    <TextField
                        label='Access Window Duration (days)'
                        type="number"
                        defaultValue={requestFileModal.duration}
                        onChange={e => setRequestFileModal(old => ({ ...old, duration: +e.target.value }))}
                    />
                    <GlassText size="moderate">Cost of Retrieval (${Math.max(costOfRetrieval, 0.01).toFixed(2)}) will be added to your monthly bill</GlassText>

                    <Button onClick={() => onRequestAccess(requestFileModal.fileId, requestFileModal.retrievalType, requestFileModal.duration)}>Request Access</Button>
                </Stack>
            </GlassSpace>
        </BaseModal>
    </DashboardLayout>
}

export default DeepStorage