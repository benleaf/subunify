import { DataTable } from "../../helpers/DataTable"
import { SheetTable } from "@/types/spreadsheet/SheetTable"
import { Button, Chip, IconButton, Stack, TextField } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { StateMachineDispatch } from "@/App"
import TableEditorTable from "./TableEditorTable"
import GlassCard from "../glassmorphism/GlassCard"
import GlassText from "../glassmorphism/GlassText"
import GlassSpace from "../glassmorphism/GlassSpace"
import { isExcelImporter } from "@/stateManagement/stateMachines/getContext"
import { Cancel, Done } from "@mui/icons-material"
import { Colours } from "@/constants/Colours"
import { CssSizes } from "@/constants/CssSizes"

type Props = {
    table: SheetTable
    tableIndex: number
}

const TableEditor = ({ table, tableIndex }: Props) => {
    const context = useContext(StateMachineDispatch)!
    if (!isExcelImporter(context)) throw new Error("TableEditorTable can only be used within the excelImporter context");
    const { dispatch, state } = context

    if (state.data.cursor == 'cell') {
        return <GlassCard paddingSize="small" marginSize="small" height='90vh'>
            <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                    variant="contained"
                    onClick={() => dispatch({ action: "finishEditing" })}
                    startIcon={<Cancel />}
                >
                    Stop Editing
                </Button>
            </div>
        </GlassCard>
    }

    return <GlassCard paddingSize="small" marginSize="small" height='calc(101vh - 85px)'>
        <Stack spacing={1}>
            <GlassSpace size="tiny" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                < TextField
                    label="Table Name"
                    style={{ minWidth: '50%' }
                    }
                    defaultValue={table.name}
                    onChange={e => dispatch({ action: "renameTable", data: e.target.value })}
                />
                < div style={{ marginLeft: CssSizes.small }}>
                    <IconButton onClick={() => dispatch({ action: "finishEditing" })} style={{ backgroundColor: Colours.primary, color: Colours.white }}>
                        <Done />
                    </IconButton>
                </div >
            </GlassSpace >
            {!table.head &&
                <GlassCard paddingSize="small" marginSize="small">
                    <GlassText size="large">Add Table Header Cells</GlassText>
                    <GlassSpace size='tiny'>
                        <Button
                            variant="contained"
                            onClick={() => dispatch({ action: "addTableColumnNames", data: tableIndex })}
                        >
                            Add Cells
                        </Button>
                    </GlassSpace>
                </GlassCard>
            }
            {
                table.head && !table.body &&
                <GlassCard paddingSize="small" marginSize="small">
                    <GlassText size="large">Add Table Records</GlassText>
                    <GlassSpace size='tiny'>
                        <Button
                            variant="contained"
                            onClick={() => dispatch({ action: "addTableData", data: tableIndex })}
                        >
                            Add Records
                        </Button>
                    </GlassSpace>
                </GlassCard>
            }
            {
                table.head && <>
                    <GlassCard paddingSize="small">
                        <TableEditorTable table={table} />
                    </GlassCard>
                </>
            }
        </Stack >
    </GlassCard >
}

export default TableEditor