import GlassText from "@/components/glassmorphism/GlassText";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { ComponentSizes } from "@/constants/ComponentSizes";
import TutorialModal from "@/components/modal/TutorialModal";
import { useSize } from "@/hooks/useSize";
import EditableTable from "@/components/TablesDataTable/EditableTable";
import { GridColDef, GridRowModel, GridValidRowModel } from "@mui/x-data-grid";
import { useAuth } from "@/auth/AuthContext";
import { useContext, useEffect, useState } from "react";
import { isError } from "@/api/isError";
import moment from "moment";
import { StateMachineDispatch } from "@/App";
import { Button } from "@mui/material";
import { Time } from "@/helpers/Time";

const DeepStorage = () => {
    const context = useContext(StateMachineDispatch)!
    const [deepStorageFiles, setDeepStorageFiles] = useState<any[]>([])
    const { height, width } = useSize()
    const { authAction } = useAuth()

    useEffect(() => {
        getFiles()
    }, [])



    const getFiles = async () => {
        const files = await authAction<any>('storage-file', 'GET')

        if (isError(files)) {

        } else {
            setDeepStorageFiles(files)
        }
    }

    const onDelete = async (id: string) => {
        const record = deepStorageFiles.find(file => file.id == id)
        if (moment(record.dateOfStorage).isAfter(moment().subtract(180, 'days'))) {
            context.dispatch({ action: 'popup', data: { colour: 'warning', message: 'Cannot delete files uploaded within 180 days' } })
            return
        }
        await authAction<any>(`storage-file/${id}`, 'DELETE')
        setDeepStorageFiles(oldFiles => oldFiles.filter(file => file.id != id))
    }

    const onRequestAccess = async (id: string) => {
        const updatedFile = await authAction<any>(`storage-file/request-restore/${id}`, 'POST')
        if (isError(updatedFile)) {
            context.dispatch({ action: 'popup', data: { colour: 'error', message: 'Unable to request access to file' } })
            console.log(updatedFile)
        } else {
            setDeepStorageFiles(oldFiles => oldFiles.map(
                file => file.id == id ?
                    { ...file, dateOfLastRestore: updatedFile.lastFileRestore } :
                    file
            ))
            context.dispatch({ action: 'popup', data: { colour: 'success', message: 'File Requested' } })
        }
    }

    const getAccessButton = (id: string, date: string | null) => {
        if (!date || moment().isAfter(moment(date).add(181, 'days'))) {
            return <Button onClick={() => onRequestAccess(id as string)}>Request Access</Button>
        } else if (moment().isBefore(moment(date).add(12, 'hours'))) {
            return <GlassText size="moderate">
                Available {Time.formatDate(moment(date).add(12, 'hours'))}
            </GlassText>
        } else if (moment().isBefore(moment(date).add(7.5, 'days'))) {
            return <Button onClick={() => onRequestAccess(id as string)}>
                Download available until: {Time.formatDate(moment(date).add(7.5, 'days'))}
            </Button>
        } else {
            return <GlassText size="moderate">
                Available {Time.formatDate(moment(date).add(181, 'days'))}
            </GlassText>
        }
    }

    const columns: GridColDef[] = [
        {
            field: 'id',
            type: 'string',
            headerName: 'ID',
            editable: false
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
            field: 'bytes',
            type: 'string',
            headerName: 'Size',
            editable: false
        },
        {
            field: 'access',
            type: 'actions',
            editable: false,
            headerName: 'Access',
            width: 120,
            getActions: ({ id, row }) => [getAccessButton(id as string, row.dateOfLastRestore)]
        }
    ]

    return <div style={{ display: 'flex' }}>
        <div style={{ height: height - ComponentSizes.topBar, width: width }}>
            <GlassCard marginSize="moderate" paddingSize="moderate" height={(height - ComponentSizes.topBar) - 45}>
                <div style={{ height: "100%", display: 'flex', flexDirection: 'column' }}>
                    <GlassText size='large'>DEEP STORE</GlassText>
                    <EditableTable
                        defaultDensity="standard"
                        columns={columns}
                        rows={deepStorageFiles}
                        deleteRecord={onDelete}
                        processRowUpdate={function (params: GridRowModel) {
                            context.dispatch({ action: 'popup', data: { colour: 'warning', message: 'Modification of description coming soon!' } })
                            return { ...params, description: '' }
                        }} />
                </div>
            </GlassCard>
        </div>
    </div >
}

export default DeepStorage