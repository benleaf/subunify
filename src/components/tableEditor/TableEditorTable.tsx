import { DataTable } from "../../helpers/DataTable"
import { SheetTable } from "@/types/spreadsheet/SheetTable"
import { Chip, IconButton, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { StateMachineDispatch } from "@/App"
import { Edit } from "@mui/icons-material"
import BaseModal from "../modal/BaseModal"
import FieldEditor from "./FieldEditor"
import { isExcelImporter } from "@/stateManagement/stateMachines/getContext"
import GlassText from "../glassmorphism/GlassText"

type Props = {
    table: SheetTable
}

type EditModalProps = { state: 'open', selectedFieldId: number } | { state: 'closed' }

const TableEditorTable = ({ table }: Props) => {
    const context = useContext(StateMachineDispatch)!
    if (!isExcelImporter(context)) throw new Error("TableEditorTable can only be used within the excelImporter context");
    const { dispatch, state } = context

    const [modalState, setModalState] = useState<EditModalProps>({ state: 'closed' })

    const [dataTable, setDataTable] = useState<DataTable>(new DataTable(table, state.data.worksheets![table.parentWorksheetId ?? 0]))
    const itemsOnPage = 5
    const recordsOnPage = 4
    const [fieldPagination, setFieldPagination] = useState<number>(1)
    const [recordPagination, setRecordPagination] = useState<number>(1)
    const displayableHeder = dataTable.header.slice((fieldPagination - 1) * itemsOnPage, (fieldPagination - 1) * itemsOnPage + itemsOnPage).reverse()
    const displayableBody = dataTable.body?.map(column => column.slice((recordPagination - 1) * recordsOnPage, (recordPagination - 1) * recordsOnPage + recordsOnPage)).reverse()

    const updatePagination = (page: number) => {
        setFieldPagination(page)
        dispatch({ action: "goToCell", data: dataTable.headerCoordinateAtIndex((page - 1) * itemsOnPage) })
    }

    const updateRecordPagination = (page: number) => {
        setRecordPagination(page)
        dispatch({ action: "goToCell", data: dataTable.bodyCoordinateAtIndex((fieldPagination - 1) * itemsOnPage, (page - 1) * recordsOnPage) })
    }

    useEffect(() => {
        const newDataTable = new DataTable(table, state.data.worksheets![table.parentWorksheetId ?? 0])
        setDataTable(newDataTable)
    }, [table.head, table.body, table.columnOverrides])


    return <Stack spacing={1}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <GlassText size="small">Column</GlassText>
                <Pagination
                    count={Math.ceil(dataTable.header.length / itemsOnPage)}
                    page={fieldPagination}
                    onChange={e => updatePagination(+(e.target as TODO).textContent)}
                />
            </div>
            {dataTable.body && <div>
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
                        <TableCell colSpan={recordsOnPage}>Values</TableCell>
                        <TableCell style={{ position: "sticky", right: 0 }}>Edit</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayableHeder.map((colVal, index) =>
                        <TableRow>
                            <TableCell>
                                <Chip label={dataTable.columns && dataTable.columns[colVal.id].type} />
                            </TableCell>
                            <TableCell variant="head" >
                                <div>{colVal.name}</div>
                            </TableCell>
                            {displayableBody && displayableBody[index].map(value => <TableCell>{value.name}</TableCell>)}
                            <TableCell
                                style={{ position: "sticky", right: 0 }}
                                variant="head"
                            >
                                <IconButton onClick={() => setModalState({ state: 'open', selectedFieldId: colVal.id })}>
                                    <Edit />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
        <BaseModal state={modalState.state} close={() => setModalState({ state: 'closed' })}>
            {
                dataTable.columns && modalState.state == 'open' && dataTable.header &&
                <FieldEditor
                    dataFormat={dataTable.columns[modalState.selectedFieldId]}
                    headderField={dataTable.header[modalState.selectedFieldId]}
                    selectedFieldId={modalState.selectedFieldId}
                />
            }
        </BaseModal>
    </Stack>
}

export default TableEditorTable