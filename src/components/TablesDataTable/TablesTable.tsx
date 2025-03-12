import { GridColDef, GridRowModel } from "@mui/x-data-grid"
import { useContext, } from "react"
import { ServerRow } from "@/types/application/ServerRow"
import { UpdateTableRowResult } from "@/types/server/UpdateTableRowResult"
import { StateMachineDispatch } from "@/App"
import { isDashboard } from "@/stateManagement/stateMachines/getContext"
import { isError } from "@/api/isError"
import EditableTable from "./EditableTable"
import { useAuth } from "@/auth/AuthContext"

const TablesTable = () => {
    const context = useContext(StateMachineDispatch)!
    if (!isDashboard(context)) throw new Error("TablesTable can only be used within the dashboard context");
    const { dispatch, state } = context
    const { authAction } = useAuth()

    const rows: ServerRow[] = state.data.selectedTable?.rows ?? []

    const createNewRecord = async (record: { [key: string]: any }) => {
        const newRow = await authAction<ServerRow>(
            `table-row`,
            'POST',
            JSON.stringify({
                record,
                tableId: state.data.selectedTable?.id
            })
        )

        if (newRow.message) {
            console.error(newRow.message)
            dispatch({ action: 'popup', data: { colour: 'error', message: 'Unable to create record' } })
        } else {
            setRows([...state.data.selectedTable?.rows ?? [], newRow])
            dispatch({ action: 'popup', data: { colour: 'success', message: 'Record created' } })
        }
    }

    const updateRemoteRows = async (rowId: string, values: { [key: string]: string }) => {
        return authAction<UpdateTableRowResult>(
            `table-row`,
            'PATCH',
            JSON.stringify({ rowId, values })
        )
    }

    const processRowUpdate = async (newRow: GridRowModel) => {
        const valuesMap = new Map<string, string>()

        for (const columnId of Object.keys(newRow)) {
            const value = newRow[columnId];
            const oldRow = rows.find(row => row.id == newRow.id)
            const dontSend = !columnId || !oldRow || oldRow[columnId] == value
            const notNullValue = value === null ? '' : value

            if (!dontSend) valuesMap.set(columnId, notNullValue)
        }
        const result = await updateRemoteRows(newRow.id, Object.fromEntries(valuesMap))

        if (isError(result)) {
            console.error(result.message)
            dispatch({ action: 'popup', data: { colour: 'error', message: 'Unable to update record' } })
            return
        }

        const newRowWithModified: GridRowModel & { modified: Date } = { ...newRow, modified: result.modified }
        setRows(rows.map((row) => (row.id === newRowWithModified.id ? newRowWithModified as ServerRow : row)))
        dispatch({ action: 'popup', data: { colour: 'success', message: 'Record Updated' } })

        return newRowWithModified
    }

    const setRows = (newRows: ServerRow[]) => {
        dispatch({ action: 'setSelectedTableRows', data: newRows })
    }

    const deleteRecord = async (id: string) => {
        const result = await authAction<UpdateTableRowResult>(
            `table-row/${id}`,
            'DELETE',
        )

        if ('message' in result) {
            console.log(result.message)
            dispatch({ action: 'popup', data: { colour: 'error', message: 'Unable to delete record' } })
        } else {
            setRows(rows.filter((row) => row.id !== id));
            dispatch({ action: 'popup', data: { colour: 'success', message: 'Record Deleted' } })
        }
    }

    const columnMetadata: GridColDef[] = [
        {
            field: 'id',
            type: 'string',
            headerName: 'ID',
            hidable: false,
            width: 100,
        },
        {
            field: 'created',
            type: 'date',
            headerName: 'Created',
            width: 110,
        },
        {
            field: 'modified',
            type: 'date',
            headerName: 'Last Modified',
            width: 110,
        },
    ]

    const cleanedColumnData = state.data.selectedTable?.columns.map(column => column.type == 'date' ? ({
        ...column, valueFormatter: (dateString: string | undefined) => dateString && (new Date(dateString)).toLocaleString()
    }) : column) as GridColDef[] | undefined

    return cleanedColumnData && <>
        <EditableTable
            name={state.data.selectedTable?.name}
            columns={[...columnMetadata, ...cleanedColumnData]}
            rows={state.data.selectedTable?.rows ?? []}
            deleteRecord={deleteRecord}
            createNewRecord={createNewRecord}
            processRowUpdate={processRowUpdate}
        />
    </>
}

export default TablesTable