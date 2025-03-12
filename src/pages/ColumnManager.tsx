import { useContext, useEffect, useState } from "react";
import { StateMachineDispatch } from "@/App";
import { GridColDef, GridRowModel, GridValidRowModel } from "@mui/x-data-grid";
import { isDashboard } from "@/stateManagement/stateMachines/getContext";
import EditableTable from "@/components/TablesDataTable/EditableTable";
import { isError } from "@/api/isError";
import { useAuth } from "@/auth/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { useSearchParams } from "react-router";
import GlassText from "@/components/glassmorphism/GlassText";
import { ServerColumn } from "@/types/application/ServerColumn";

const ColumnManager = () => {
    const context = useContext(StateMachineDispatch)!
    const [searchParams] = useSearchParams();
    const tableId: string | null = searchParams.get('id')
    const [columns, setColumns] = useState<ServerColumn[]>([])
    const { authAction } = useAuth()

    const getTable = async () => {
        if (
            !tableId ||
            !isDashboard(context) ||
            context.state.data.selectedTable?.id === tableId
        ) return

        const result = await authAction<ServerColumn[]>(`table-column/by-table/${tableId}`, 'GET')

        if (isError(result)) {
            console.error(result)
        } else {
            setColumns(result)
        }
    }

    useEffect(() => {
        getTable()
    }, [tableId, isDashboard(context)])

    useEffect(() => {
        context.dispatch({ action: 'startDashboard' })
    }, [])

    const columnMetadata: GridColDef[] = [
        {
            field: 'id',
            type: 'string',
            headerName: 'Column ID',
            hidable: false,
            width: 220,
        },
        {
            field: 'name',
            type: 'string',
            editable: true,
            headerName: 'Name',
            width: 180,
        },
        {
            field: 'type',
            type: 'singleSelect',
            editable: true,
            headerName: 'Type',
            width: 180,
            valueOptions: ['text', 'number', 'date', 'unknown'],
        },
    ]

    const rows = () => {
        if (!isDashboard(context)) return []
        return columns.map(column => ({
            id: column.id,
            name: column.name,
            type: column.type
        })) ?? []
    }

    const createNewRecord = async (record: { [key: string]: any }) => {
        if (!isDashboard(context) || !tableId) return
        const result = await authAction<ServerColumn>(`table-column`, 'POST', JSON.stringify({
            tableId,
            ...record
        }))
        if (isError(result)) {
            console.error(result)
            context.dispatch({ action: 'popup', data: { colour: 'error', message: 'Failed to create new column' } })
        } else {
            setColumns(oldColumns => [...oldColumns, result])
            context.dispatch({ action: 'popup', data: { colour: 'success', message: 'Column created successfully' } })
        }
    }

    const deleteRecord = async (id: string) => {
        if (!isDashboard(context)) return
        const result = await authAction<object>(`table-column/${id}`, 'DELETE')
        if (isError(result)) {
            console.error(result)
            context.dispatch({ action: 'popup', data: { colour: 'error', message: 'Failed to delete new column' } })
        } else {
            setColumns(oldColumns => oldColumns.filter(column => column.id != id))
            context.dispatch({ action: 'popup', data: { colour: 'success', message: 'Column deleted successfully' } })
        }
    }

    const updateRecord = async (params: GridRowModel): Promise<GridValidRowModel> => {
        if (!isDashboard(context)) return {}
        const result = await authAction<object>(`table-column/${params.id}`, 'POST', JSON.stringify(params))

        if (isError(result)) {
            console.error(result)
            context.dispatch({ action: 'popup', data: { colour: 'error', message: 'Unable to update column' } })
            return {}
        } else {
            const newColumns = columns.map(column => column.id === params.id ? params as ServerColumn : column)
            console.log(newColumns)
            setColumns(newColumns)
            context.dispatch({ action: 'popup', data: { colour: 'success', message: 'Column updated successfully' } })
            return params
        }
    }

    return isDashboard(context) && isDashboard(context) && <DashboardLayout>
        <GlassText size='huge'>Column Manager</GlassText>
        <EditableTable
            name="Column"
            columns={[...columnMetadata]}
            rows={rows()}
            deleteRecord={deleteRecord}
            createNewRecord={createNewRecord}
            processRowUpdate={updateRecord}
        />
    </DashboardLayout>
}

export default ColumnManager