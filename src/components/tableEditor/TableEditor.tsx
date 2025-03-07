import { DataTable } from "../../helpers/DataTable"
import { SheetTable } from "@/types/spreadsheet/SheetTable"
import { Button, Chip, IconButton, Stack, TextField } from "@mui/material"
import { Worksheet } from "exceljs"
import { useContext, useEffect, useState } from "react"
import { StateMachineDispatch } from "@/App"
import TableEditorTable from "./TableEditorTable"
import GlassCard from "../glassmorphism/GlassCard"
import GlassText from "../glassmorphism/GlassText"
import GlassSpace from "../glassmorphism/GlassSpace"
import BaseModal from "../modal/BaseModal"
import { Edit } from "@mui/icons-material"
import { isExcelImporter } from "@/stateManagment/stateMachines/getContext"

type Props = {
    table: SheetTable
    tableIndex: number
}

const TableEditor = ({ table, tableIndex }: Props) => {
    const context = useContext(StateMachineDispatch)!
    if (!isExcelImporter(context)) throw new Error("TableEditorTable can only be used within the excelImporter context");
    const { dispatch, state } = context

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [dataTable, setDataTable] = useState<DataTable>(new DataTable(table, state.data.worksheets![table.parentWorksheetId ?? 0]))

    useEffect(() => {
        const newDataTable = new DataTable(table, state.data.worksheets![table.parentWorksheetId ?? 0])
        setDataTable(newDataTable)
    }, [table.head, table.body])


    return <GlassCard paddingSize="small" marginSize="small">
        <Stack direction='row'>
            <GlassText size="huge">{table.name}</GlassText>
            <IconButton onClick={() => setEditModalOpen(true)}>
                <Edit />
            </IconButton>
        </Stack>
        <Stack spacing={1}>
            {!table.head &&
                <GlassCard>
                    <GlassText size="large">Add Table Columns</GlassText>
                    <GlassSpace size='tiny'>
                        <Button
                            variant="contained"
                            onClick={() => dispatch({ action: "addTableColumnNames", data: tableIndex })}
                        >
                            Add
                        </Button>
                    </GlassSpace>
                </GlassCard>
            }
            {table.head && <>
                <Stack spacing={1} direction='row'>
                    <Chip label={`${dataTable.header.length} field${dataTable.header.length != 1 ? 's' : ''}`} />
                    {dataTable.body && <Chip label={`${dataTable.body[0].length} record${dataTable.body[0].length != 1 ? 's' : ''}`} />}
                </Stack>
                <GlassCard paddingSize="small" marginSize="small">
                    <TableEditorTable table={table} />
                </GlassCard>
            </>}
            {table.head && !table.body &&
                <GlassCard paddingSize="small" marginSize="small">
                    <GlassText size="large">Add table Data</GlassText>
                    <GlassSpace size='tiny'>
                        <Button
                            variant="contained"
                            onClick={() => dispatch({ action: "addTableData", data: tableIndex })}
                        >
                            Add
                        </Button>
                    </GlassSpace>
                </GlassCard>
            }
            <Button onClick={() => dispatch({ action: "finishEditing" })} variant="contained">Done</Button>
        </Stack>
        <BaseModal state={editModalOpen ? 'open' : 'closed'} close={() => setEditModalOpen(false)}>
            <TextField
                fullWidth
                label="Table Name"
                defaultValue={table.name}
                onChange={e => dispatch({ action: "renameTable", data: e.target.value })}
            />
        </BaseModal>
    </GlassCard>
}

export default TableEditor