import { useContext, useEffect } from "react";
import { StateMachineDispatch } from "@/App";
import { GridColDef, GridRowModel, GridValidRowModel } from "@mui/x-data-grid";
import { isDashboard } from "@/stateManagement/stateMachines/getContext";
import EditableTable from "@/components/TablesDataTable/EditableTable";
import { isError } from "@/api/isError";
import { TableResult } from "@/types/server/TableResult";
import { useAuth } from "@/auth/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";

const TableManager = () => {
    const context = useContext(StateMachineDispatch)!
    const { authAction } = useAuth()

    useEffect(() => {
        context.dispatch({ action: 'startDashboard' })
    }, [])

    const columnMetadata: GridColDef[] = [
        {
            field: 'id',
            type: 'string',
            headerName: 'Table ID',
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
            field: 'visible',
            type: 'boolean',
            editable: true,
            headerName: 'Visibility',
            width: 120,
        },
    ]

    const rows = () => {
        if (!isDashboard(context)) return []
        return context.state.data.tables?.map(table => ({
            id: table.id,
            name: table.name,
            visible: table.visible
        })) ?? []
    }

    const createNewRecord = async (record: { [key: string]: any }) => {
        if (!isDashboard(context)) return
        const result = await authAction<TableResult>(`table`, 'POST', JSON.stringify(record))
        if (isError(result)) {
            console.error(result)
        } else {
            const tables = context.state.data.tables ?? []
            context.dispatch({ action: 'tableGetAll', data: tables.concat({ ...result, totalRecords: 0 }) })
            context.dispatch({ action: 'popup', data: { colour: 'success', message: 'Table created successfully' } })
        }
    }

    const updateRecord = async (params: GridRowModel): Promise<GridValidRowModel> => {
        if (!isDashboard(context)) return {}
        const result = await authAction<TableResult>(`table/${params.id}`, 'POST', JSON.stringify(params))
        if (isError(result)) {
            console.error(result)
            return {}
        } else {
            const tables = context.state.data.tables ?? []
            tables.splice(tables.findIndex(table => table.id === params.id), 1, params as TableResult)
            context.dispatch({ action: 'tableGetAll', data: tables })
            context.dispatch({ action: 'popup', data: { colour: 'success', message: 'Table created successfully' } })
            return params
        }
    }

    return isDashboard(context) && isDashboard(context) && <DashboardLayout>
        <EditableTable
            name="Table"
            columns={[...columnMetadata]}
            rows={rows()}
            deleteRecord={() => context.dispatch({ action: 'popup', data: { colour: 'info', message: 'Deleting tables is universally disabled for now' } })}
            createNewRecord={createNewRecord}
            processRowUpdate={updateRecord}
        />
    </DashboardLayout>
}

export default TableManager