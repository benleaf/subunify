import { SheetTable } from "@/types/spreadsheet/SheetTable"
import { Button, Chip, Divider, IconButton, Stack } from "@mui/material"
import { Worksheet } from "exceljs"
import { useContext, useState } from "react"
import { StateMachineDispatch } from "@/App"
import { Delete, Edit } from "@mui/icons-material"
import GlassCard from "../glassmorphism/GlassCard"
import GlassSpaceBox from "../glassmorphism/GlassSpaceBox"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { isExcelImporter } from "@/stateManagement/stateMachines/getContext"
import BaseModal from "../modal/BaseModal"
import { DataTable } from "@/helpers/DataTable"

type Props = {
    table: SheetTable,
    worksheet: Worksheet,
    tableIndex: number,
}

const TableControlWidget = ({ table, tableIndex, worksheet }: Props) => {
    const context = useContext(StateMachineDispatch)!
    if (!isExcelImporter(context)) throw new Error("TableControlWidget can only be used within the excelImporter context");
    const dataTable = new DataTable(table, worksheet)
    const { dispatch } = context
    const [tableToDelete, setTableToDelete] = useState<number>()

    const header = dataTable
        .header
        .filter(item => item.removed === false)

    const body: (string | undefined)[][] | undefined = dataTable
        .body?.filter((_, index) => dataTable.header[index].removed === false)
        .map(
            column => column
                .filter(item => item.removed === false)
                .map(item => item.name)
        )

    return <GlassCard marginSize="tiny" paddingSize="moderate" flex={1}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <GlassText size="large">{table.name}</GlassText>
            <div>
                <IconButton onClick={() => dispatch({ action: "editTable", data: tableIndex })}>
                    <Edit />
                </IconButton>
                <IconButton onClick={() => setTableToDelete(tableIndex)}>
                    <Delete />
                </IconButton>
            </div>
        </div>
        <GlassSpaceBox>
            <Stack spacing={1} width='100%'>
                {header.slice(0, 3).map((colVal, index) =>
                    <GlassCard marginSize="tiny" paddingSize="tiny">
                        <GlassSpace size="tiny">
                            <GlassText size="moderate">{colVal.name}</GlassText>
                            <GlassText size="small">
                                Values: {body?.length == header.length && body[index].slice(0, 3).join(', ')}
                            </GlassText>
                        </GlassSpace>
                    </GlassCard>
                )}
                <GlassSpace size="tiny">
                    <GlassText size="moderate">
                        <Stack spacing={1} direction='row'>
                            <Chip label={`${header.length} field${header.length != 1 ? 's' : ''}`} />
                            {body && body[0] && <Chip label={`${body[0].length} record${body[0].length != 1 ? 's' : ''}`} />}
                        </Stack>
                    </GlassText>
                </GlassSpace>
            </Stack>
        </GlassSpaceBox>
        <BaseModal state={tableToDelete == undefined ? 'closed' : 'open'} close={() => setTableToDelete(undefined)}>
            <GlassSpace size="large">
                <Stack direction='column' spacing={2}>
                    <GlassText size="large">
                        Are you sure you wish to perform this delete action?
                    </GlassText>
                    <Divider />
                    <Stack direction='row' spacing={2}>
                        <Button style={{ flex: 1 }} variant="outlined" onClick={() => dispatch({ action: "deleteTable", data: tableToDelete! })}>Yes</Button>
                        <Button style={{ flex: 1 }} variant="contained" onClick={() => setTableToDelete(undefined)}>No</Button>
                    </Stack>
                </Stack>
            </GlassSpace>
        </BaseModal>
    </GlassCard>
}

export default TableControlWidget