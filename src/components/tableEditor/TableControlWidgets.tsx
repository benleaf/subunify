import { Stack, Card, Paper, Button } from "@mui/material"
import TableControlWidget from "./TableControlWidget"
import { Workbook } from "exceljs"
import { useContext } from "react"
import { StateMachineDispatch } from "../sheet/SheetTabs"
import { SheetTable } from "@/types/SheetTable"


type Props = {
    workbook: Workbook,
    tables: SheetTable[],
}

const TableControlWidgets = ({ workbook, tables }: Props) => {
    const dispatch = useContext(StateMachineDispatch)!

    return <Stack flex={1}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {tables.map((table, index) =>
                <TableControlWidget
                    table={table}
                    tableIndex={index}
                    worksheet={workbook.worksheets[table.parentWorksheetId]}
                />
            )}
            <Card component={Paper} sx={{ margin: '0.5em', padding: '1em', width: '20em', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                <Button style={{ width: '100%', height: '100%' }} onClick={() => dispatch({ action: "createTable" })}>Create Table!</Button>
            </Card>
        </div>
    </Stack>
}

export default TableControlWidgets