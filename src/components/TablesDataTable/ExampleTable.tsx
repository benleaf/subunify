import { GridColDef, GridRowModel } from "@mui/x-data-grid"
import { ServerRow } from "@/types/application/ServerRow"
import EditableTable from "./EditableTable"
import { useContext, useState } from "react"
import { StateMachineDispatch } from "@/App"
import { Button, IconButton } from "@mui/material"
import { fakeData } from "./fakeData"
import { CopyAll } from "@mui/icons-material"

const ExampleTable = () => {
    const { dispatch } = useContext(StateMachineDispatch)!

    const [rows, setRows] = useState<{ [key: string]: any }[]>(fakeData)

    const createNewRecord = async (record: { [key: string]: any }) => {
        setRows(oldRows => [...oldRows ?? [], { id: oldRows.length + 1, ...record }])
        dispatch({ action: 'popup', data: { colour: 'success', message: 'Record created' } })
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

        setRows(rows.map((row) => (row.id === newRow.id ? newRow as ServerRow : row)))
        dispatch({ action: 'popup', data: { colour: 'success', message: 'Record Updated' } })

        return newRow
    }

    const deleteRecord = async (id: string) => {
        setRows(rows.filter((row) => row.id !== id));
        dispatch({ action: 'popup', data: { colour: 'success', message: 'Record Deleted' } })
    }

    const columnMetadata: GridColDef[] = [
        {
            field: 'downloadLink',
            type: 'actions',
            width: 120,
            headerName: 'Download Link',
            editable: false,
            getActions: () => [<IconButton><CopyAll /></IconButton>]
        },
        {
            field: 'name',
            type: 'string',
            headerName: 'Name',
            editable: true
        },
        {
            field: 'description',
            type: 'string',
            width: 400,
            headerName: 'Description',
            editable: true
        },
        {
            field: 'dateOfStorage',
            type: 'date',
            headerName: 'Date Stored',
            editable: false
        },
        {
            field: 'fileDownload',
            type: 'actions',
            editable: false,
            getActions: () => [<Button>Download</Button>]
        }
    ]

    return <EditableTable
        style={{ flex: 1 }}
        name={'Data'}
        columns={[...columnMetadata]}
        rows={rows}
        deleteRecord={deleteRecord}
        createNewRecord={createNewRecord}
        processRowUpdate={processRowUpdate}
    />
}

export default ExampleTable