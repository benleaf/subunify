import { DataTable } from "../../helpers/DataTable"
import { SheetTable } from "@/types/SheetTable"
import { Button, Card, Chip, Input, Paper, Stack } from "@mui/material"
import { Worksheet } from "exceljs"
import { useContext, useEffect, useState } from "react"
import { StateMachineDispatch } from "../sheet/SheetTabs"
import TableEditorTable from "./TableEditorTable"

type Props = {
    table: SheetTable
    worksheets: Worksheet[],
    tableIndex: number
}

const TableEditor = ({ table, worksheets, tableIndex }: Props) => {
    const dispatch = useContext(StateMachineDispatch)!
    const [dataTable, setDataTable] = useState<DataTable>(new DataTable(table, worksheets[table.parentWorksheetId ?? 0]))

    useEffect(() => {
        const newDataTable = new DataTable(table, worksheets[table.parentWorksheetId ?? 0])
        setDataTable(newDataTable)
    }, [table.head, table.body])


    return <Card component={Paper} sx={{ margin: '0.5em', padding: '1em', flex: 1 }}>
        <Stack spacing={1}>
            <Button onClick={() => dispatch({ action: "finishEditing" })} variant="contained">Done</Button>
            {!table.head && <Button onClick={() => dispatch({ action: "addTableColumnNames", data: tableIndex })}>Add table column names</Button>}
            {table.head && !table.body && <Button onClick={() => dispatch({ action: "addTableData", data: tableIndex })}>Add table Data</Button>}
            <Input value={table.name} onChange={e => dispatch({ action: "renameTable", data: e.target.value })} />
            <Stack spacing={1} direction='row'>
                <Chip label={`${dataTable.header.length} field${dataTable.header.length != 1 ? 's' : ''}`} />
                {dataTable.body && <Chip label={`${dataTable.body[0].length} record${dataTable.body[0].length != 1 ? 's' : ''}`} />}
            </Stack>

            <TableEditorTable table={table} worksheets={worksheets} />
        </Stack>
    </Card>
}

export default TableEditor