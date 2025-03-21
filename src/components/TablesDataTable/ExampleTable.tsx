import { GridColDef, GridRowModel } from "@mui/x-data-grid"
import { ServerRow } from "@/types/application/ServerRow"
import EditableTable from "./EditableTable"
import { useContext, useState } from "react"
import { StateMachineDispatch } from "@/App"

const ExampleTable = () => {
    const { dispatch } = useContext(StateMachineDispatch)!

    const [rows, setRows] = useState<{ [key: string]: any }[]>([
        { id: 2, name: 'Tim Telly', address: '123 Random st', probability: 3, priority: 'Low' },
        { id: 3, name: 'Hannah Hull', address: '21 Main st', probability: 6, priority: 'Medium' },
        { id: 4, name: 'Kristina Kelly', address: '14 Church ave', probability: 9, priority: 'High' },
        { id: 12, name: 'Tim Telly', address: '123 Random st', probability: 3, priority: 'Low' },
        { id: 13, name: 'Hannah Hull', address: '21 Main st', probability: 6, priority: 'Medium' },
        { id: 14, name: 'Kristina Kelly', address: '14 Church ave', probability: 9, priority: 'High' },
        { id: 22, name: 'Tim Telly', address: '123 Random st', probability: 3, priority: 'Low' },
        { id: 23, name: 'Hannah Hull', address: '21 Main st', probability: 6, priority: 'Medium' },
        { id: 24, name: 'Kristina Kelly', address: '14 Church ave', probability: 9, priority: 'High' },
    ])

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
            field: 'name',
            type: 'string',
            headerName: 'name',
            editable: true
        },
        {
            field: 'address',
            type: 'string',
            headerName: 'address',
            width: 110,
            editable: true
        },
        {
            field: 'probability',
            type: 'number',
            headerName: 'Likely to do business score',
            width: 110,
            editable: true
        },
        {
            field: 'priority',
            type: 'string',
            headerName: 'Priority',
            width: 110,
            editable: true
        },
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