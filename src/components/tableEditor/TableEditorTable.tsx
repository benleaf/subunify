import { DataTable } from "../../helpers/DataTable"
import { SheetTable } from "@/types/spreadsheet/SheetTable"
import { Button, Chip, Divider, IconButton, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { StateMachineDispatch } from "@/App"
import { Delete, Edit } from "@mui/icons-material"
import BaseModal from "../modal/BaseModal"
import FieldEditor from "./FieldEditor"
import { isExcelImporter } from "@/stateManagement/stateMachines/getContext"
import GlassText from "../glassmorphism/GlassText"
import GlassSpace from "../glassmorphism/GlassSpace"
import { useSize } from "@/hooks/useSize"
import { ScreenWidths } from "@/constants/ScreenWidths"
import { DataField } from "@/types/DataField"

type Props = {
    table: SheetTable
}

type EditModalProps =
    { state: 'open', action: 'edit', localField: number, globalField: number } |
    { state: 'open', action: 'delete', globalField: number } |
    { state: 'closed' }

const TableEditorTable = ({ table }: Props) => {
    const context = useContext(StateMachineDispatch)!
    if (!isExcelImporter(context)) throw new Error("TableEditorTable can only be used within the excelImporter context");
    const { dispatch, state } = context

    const [fieldPagination, setFieldPagination] = useState<number>(1)
    const [recordPagination, setRecordPagination] = useState<number>(1)
    const [modalState, setModalState] = useState<EditModalProps>({ state: 'closed' })
    const [dataTable, setDataTable] = useState<DataTable>(new DataTable(table, state.data.worksheets![table.parentWorksheetId ?? 0]))
    const { width } = useSize()

    const itemsOnPage = 5
    const recordsOnPage = width > ScreenWidths.Tablet ? 4 : 2

    const displayableHeder = dataTable
        .header
        .filter(item => item.removed === false)
        .slice((fieldPagination - 1) * itemsOnPage, (fieldPagination - 1) * itemsOnPage + itemsOnPage)

    const displayableBody: (DataField | undefined)[][] | undefined = dataTable
        .body?.filter((_, index) => dataTable.header[index].removed === false)
        .map(
            column => column
                .filter(item => item.removed === false)
                .slice((recordPagination - 1) * recordsOnPage, (recordPagination - 1) * recordsOnPage + recordsOnPage)
        )

    const updatePagination = (page: number) => {
        setFieldPagination(page)
        dispatch({ action: "goToCell", data: dataTable.headerCoordinateAtIndex((page - 1) * itemsOnPage) })
    }

    const updateRecordPagination = (page: number) => {
        setRecordPagination(page)
        dispatch({ action: "goToCell", data: dataTable.bodyCoordinateAtIndex((fieldPagination - 1) * itemsOnPage, (page - 1) * recordsOnPage) })
    }

    const deleteColumn = (columnId: number) => {
        dispatch({
            action: "modifyColumn",
            data: { columnId: columnId, value: null }
        })
        setModalState({ state: 'closed' })
    }

    useEffect(() => {
        setDataTable(new DataTable(table, state.data.worksheets![table.parentWorksheetId ?? 0]))
    }, [table.head, table.body, table.columnOverrides])


    return <Stack spacing={1}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div>
                <GlassText size="small">Column</GlassText>
                <Pagination
                    count={Math.ceil(dataTable.header.length / itemsOnPage)}
                    page={fieldPagination}
                    onChange={e => updatePagination(+(e.target as TODO).textContent)}
                />
            </div>
            {width > ScreenWidths.Mobile && dataTable.body && <div>
                <GlassText size="small">Row</GlassText>
                <Pagination
                    count={Math.ceil(dataTable.body[0].length / recordsOnPage)}
                    page={recordPagination}
                    onChange={e => updateRecordPagination(+(e.target as TODO).textContent)}
                />
            </div>}
        </div>
        <TableContainer component={Paper}>
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Field</TableCell>
                        {displayableBody?.length && displayableBody[0].length > 0 &&
                            <TableCell colSpan={Math.min(displayableBody[0].length, recordsOnPage)}>Values</TableCell>
                        }
                        <TableCell style={{ position: "sticky", right: 0 }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayableHeder.map((colVal, index) =>
                        <TableRow>
                            <TableCell>
                                <Chip label={dataTable.columns?.length && dataTable.columns[index].type} />
                            </TableCell>
                            <TableCell variant="head" >
                                <div>{colVal.name}</div>
                            </TableCell>
                            {displayableBody?.length && displayableBody[0].map((_, rowIndex) => <TableCell>{displayableBody[index][rowIndex]?.name ?? ''}</TableCell>)}
                            <TableCell
                                style={{ position: "sticky", right: 0 }}
                                variant="head"
                            >
                                <Stack direction='row'>
                                    <IconButton onClick={() => setModalState({
                                        state: 'open',
                                        localField: colVal.localIndex,
                                        globalField: colVal.globalIndex,
                                        action: 'edit'
                                    })}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => setModalState({ state: 'open', globalField: colVal.globalIndex, action: 'delete' })}>
                                        <Delete />
                                    </IconButton>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
        <BaseModal state={modalState.state} close={() => setModalState({ state: 'closed' })}>
            {dataTable.columns && dataTable.header && modalState.state === 'open' &&
                <GlassSpace size="large">
                    <Stack direction='column' spacing={2}>
                        {modalState.action === 'edit' && dataTable.header.length >= modalState.localField && <>
                            <FieldEditor
                                defaultValue={dataTable.header[modalState.localField].name}
                                selectedFieldId={modalState.globalField}
                            />
                        </>}
                        {modalState.action === 'delete' && <>
                            <GlassText size="large">
                                Are you sure you wish to perform this delete action?
                            </GlassText>
                            <Divider />
                            <Stack direction='row' spacing={2}>
                                <Button
                                    style={{ flex: 1 }}
                                    variant="outlined"
                                    onClick={() => deleteColumn(modalState.globalField)}
                                >
                                    Yes
                                </Button>
                                <Button
                                    style={{ flex: 1 }}
                                    variant="contained"
                                    onClick={() => setModalState({ state: 'closed' })}
                                >
                                    No
                                </Button>
                            </Stack>
                        </>}
                    </Stack>
                </GlassSpace>
            }
        </BaseModal>
    </Stack>
}

export default TableEditorTable