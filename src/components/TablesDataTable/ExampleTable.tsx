import { GridColDef, GridRowModel } from "@mui/x-data-grid"
import { ServerRow } from "@/types/application/ServerRow"
import EditableTable from "./EditableTable"
import { useContext, useState } from "react"
import { StateMachineDispatch } from "@/App"
import { Button } from "@mui/material"
import { fakeData } from "./fakeData"

const ExampleTable = () => {
    const { dispatch } = useContext(StateMachineDispatch)!

    const [rows, setRows] = useState<{ [key: string]: any }[]>(fakeData)

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
            field: 'access',
            type: 'actions',
            editable: false,
            headerName: 'Access',
            width: 150,
            getActions: () => [<Button variant="outlined" > Request Access </Button>]
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

    return <EditableTable
        defaultDensity="standard"
        style={{ flex: 1 }}
        name={'Data'}
        columns={[...columnMetadata]}
        rows={rows}
        deleteRecord={deleteRecord}
        processRowUpdate={processRowUpdate}
    />
}

export default ExampleTable