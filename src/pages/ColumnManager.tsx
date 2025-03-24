import { useContext, useEffect, useState } from "react";
import { StateMachineDispatch } from "@/App";
import { GridColDef, GridRowModel, GridValidRowModel } from "@mui/x-data-grid";
import { isDashboard } from "@/stateManagement/stateMachines/getContext";
import EditableTable from "@/components/TablesDataTable/EditableTable";
import { isError } from "@/api/isError";
import { useAuth } from "@/auth/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { useSearchParams } from "react-router";
import GlassText from "@/components/glassmorphism/GlassText";
import { ServerColumn } from "@/types/application/ServerColumn";
import { ServerTable } from "@/types/application/ServerTable";
import { ArrowBack } from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import FormulaBuilder from "@/components/form/FormulaBuilder";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import BaseModal from "@/components/modal/BaseModal";
import { JsonLogicEquation } from "@/formulas";

const ColumnManager = () => {
    const context = useContext(StateMachineDispatch)!
    const [searchParams] = useSearchParams();
    const tableId: string | null = searchParams.get('id')
    const [table, setTable] = useState<ServerTable>()
    const [columns, setColumns] = useState<ServerColumn[]>([])
    const [editColumnModal, setEditColumnModal] = useState<string | undefined>()
    const editColumn = columns.find(column => column.id == editColumnModal)

    const { authAction } = useAuth()

    const getColumns = async () => {
        if (
            !tableId ||
            !isDashboard(context) ||
            context.state.data.selectedTable?.id === tableId
        ) return

        const result = await authAction<ServerColumn[]>(`table-column/by-table/${tableId}`, 'GET')

        if (isError(result)) {
            console.error(result)
        } else {
            setColumns(result)
        }
    }

    const getTable = async () => {
        if (!tableId) return
        const result = await authAction<ServerTable>(`table/${tableId}`, 'GET')

        if (isError(result)) {
            console.error(result)
        } else {
            setTable(result)
        }
    }

    useEffect(() => {
        getColumns()
        getTable()
    }, [tableId, isDashboard(context)])

    useEffect(() => {
        context.dispatch({ action: 'startDashboard' })
    }, [])

    const columnMetadata: GridColDef[] = [
        {
            field: 'id',
            type: 'string',
            headerName: 'Column ID',
            hidable: false,
            width: 220,
        },
        {
            field: 'name',
            type: 'string',
            editable: true,
            headerName: 'Name',
            width: 180,
        },
        {
            field: 'type',
            type: 'singleSelect',
            editable: true,
            headerName: 'Type',
            width: 180,
            valueOptions: ['text', 'number', 'date', 'formula', 'unknown'],
        },
        {
            field: 'edit',
            type: 'actions',
            editable: false,
            headerName: 'Edit Properties',
            width: 120,
            getActions: ({ id }) => [<Button onClick={() => setEditColumnModal(id as string)}>Edit</Button>]
        }
    ]

    const rows = () => {
        if (!isDashboard(context)) return []
        return columns.map(column => ({
            id: column.id,
            name: column.name,
            type: column.type
        })) ?? []
    }

    const createNewRecord = async (record: { [key: string]: any }) => {
        if (!isDashboard(context) || !tableId) return
        const result = await authAction<ServerColumn>(`table-column`, 'POST', JSON.stringify({
            tableId,
            ...record
        }))
        if (isError(result)) {
            console.error(result)
            context.dispatch({ action: 'popup', data: { colour: 'error', message: 'Failed to create new column' } })
        } else {
            setColumns(oldColumns => [...oldColumns, result])
            context.dispatch({ action: 'popup', data: { colour: 'success', message: 'Column created successfully' } })
        }
    }

    const deleteRecord = async (id: string) => {
        if (!isDashboard(context)) return
        const result = await authAction<object>(`table-column/${id}`, 'DELETE')
        if (isError(result)) {
            console.error(result)
            context.dispatch({ action: 'popup', data: { colour: 'error', message: 'Failed to delete new column' } })
        } else {
            setColumns(oldColumns => oldColumns.filter(column => column.id != id))
            context.dispatch({ action: 'popup', data: { colour: 'success', message: 'Column deleted successfully' } })
        }
    }

    const updateRecord = async (params: GridRowModel): Promise<GridValidRowModel> => {
        if (!isDashboard(context)) return {}
        const result = await authAction<object>(`table-column/${params.id}`, 'POST', JSON.stringify(params))

        if (isError(result)) {
            console.error(result)
            context.dispatch({ action: 'popup', data: { colour: 'error', message: 'Unable to update column' } })
            return {}
        } else {
            const newColumns = columns.map(column => column.id === params.id ? params as ServerColumn : column)
            console.log(newColumns)
            setColumns(newColumns)
            context.dispatch({ action: 'popup', data: { colour: 'success', message: 'Column updated successfully' } })
            return params
        }
    }

    const updateRecordOptions = async (columnId: string, options: JsonLogicEquation) => {
        if (!isDashboard(context)) return {}
        const updateBody = JSON.stringify({ options: JSON.stringify(options) })
        const result = await authAction<object>(`table-column/${columnId}`, 'POST', updateBody)

        if (isError(result)) {
            console.error(result)
            context.dispatch({ action: 'popup', data: { colour: 'error', message: 'Unable to update column' } })
        } else {
            const newColumns = columns.map(
                column => ({
                    ...column,
                    options: column.id === columnId ? options : column.options
                } as ServerColumn)
            )

            setColumns(newColumns)
            context.dispatch({ action: 'popup', data: { colour: 'success', message: 'Column updated successfully' } })
            setEditColumnModal(undefined)
        }
    }

    return isDashboard(context) && isDashboard(context) && <DashboardLayout>
        <Stack direction='row' spacing={2} alignItems='center'>
            <div>
                <IconButton href="/table-manager" size="small" style={{ padding: 0 }}>
                    <ArrowBack color="primary" />
                </IconButton>
            </div>
            <GlassText size='huge'>{table?.name} Column Manager</GlassText>
        </Stack>
        <EditableTable
            name="Column"
            columns={[...columnMetadata]}
            rows={rows()}
            deleteRecord={deleteRecord}
            createNewRecord={createNewRecord}
            processRowUpdate={updateRecord}
        />
        <BaseModal state={editColumnModal ? 'open' : 'closed'} maxWidth={700} close={() => setEditColumnModal(undefined)}>
            <GlassSpace size="moderate" style={{ maxHeight: '80vh', overflowY: 'scroll', }}>
                <GlassText size="large">Formula Editor: {editColumn?.name}</GlassText>
                {editColumn?.type == 'formula' &&
                    <FormulaBuilder
                        initialJsonLogic={editColumn.options as JsonLogicEquation}
                        dataInputs={
                            columns.filter(column => column.type == 'number')
                                .map(column => ({ displayName: column.name, id: column.id, type: column.type as any }))
                        }
                        onSubmit={(options: JsonLogicEquation) => editColumnModal && updateRecordOptions(editColumnModal, options)}
                    />
                }
                {editColumn?.type != 'formula' && <GlassText size="moderate">Editor not available for this type</GlassText>}
            </GlassSpace>
        </BaseModal>
    </DashboardLayout>
}

export default ColumnManager