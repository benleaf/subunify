import { useContext, useEffect } from "react";
import Sidebar from "@/components/navigation/Sidebar";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { useSize } from "@/hooks/useSize";
import { ComponentSizes } from "@/constants/ComponentSizes";
import { StateMachineDispatch } from "@/App";
import { GridColDef, GridRowModel, GridValidRowModel } from "@mui/x-data-grid";
import { isDashboard } from "@/stateManagement/stateMachines/getContext";
import EditableTable from "@/components/TablesDataTable/EditableTable";
import GlassText from "@/components/glassmorphism/GlassText";
import { CssSizes } from "@/constants/CssSizes";
import { ServerTable } from "@/types/application/ServerTable";
import { isError } from "@/api/isError";
import { TableResult } from "@/types/server/TableResult";
import { useAuth } from "@/auth/AuthContext";

const TableManager = () => {
    const context = useContext(StateMachineDispatch)!
    const { height, width } = useSize()
    const { authAction, logout } = useAuth()

    useEffect(() => {
        context.dispatch({ action: 'startDashboard' })
    }, [])

    const columnMetadata: GridColDef[] = [
        {
            field: 'id',
            type: 'string',
            headerName: 'Table ID',
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
            field: 'visible',
            type: 'boolean',
            editable: true,
            headerName: 'Visibility',
            width: 120,
        },
    ]

    const rows = () => {
        if (!isDashboard(context)) return []
        return context.state.data.tables?.map(table => ({
            id: table.id,
            name: table.name,
            visible: table.visible
        })) ?? []
    }

    const createNewRecord = async (record: { [key: string]: any }) => {
        if (!isDashboard(context)) return
        const result = await authAction<ServerTable>(`table`, 'POST', JSON.stringify(record))
        if (isError(result)) {
            console.error(result)
        } else {
            const tables = context.state.data.tables ?? []
            context.dispatch({ action: 'tableGetAll', data: tables.concat({ ...result, totalRecords: 0 }) })
            context.dispatch({ action: 'popup', data: { colour: 'success', message: 'Table created successfully' } })
        }
    }

    const updateRecord = async (params: GridRowModel): Promise<GridValidRowModel> => {
        if (!isDashboard(context)) return {}
        const result = await authAction<TableResult>(`table/${params.id}`, 'POST', JSON.stringify(params))
        if (isError(result)) {
            console.error(result)
            return {}
        } else {
            const tables = context.state.data.tables ?? []
            tables.splice(tables.findIndex(table => table.id === params.id), 1, params as TableResult)
            context.dispatch({ action: 'tableGetAll', data: tables })
            context.dispatch({ action: 'popup', data: { colour: 'success', message: 'Table created successfully' } })
            return params
        }
    }

    return isDashboard(context) && <>
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ height: height - ComponentSizes.topBar, width: width - ComponentSizes.sideBar }}>
                <div style={{ marginLeft: CssSizes.moderate, marginTop: CssSizes.moderate }}>
                    <GlassText size='large'>Table Manager</GlassText>
                </div>
                <GlassCard marginSize="moderate" paddingSize="moderate" height={(height - ComponentSizes.topBar) - 45}>
                    <EditableTable
                        name="Table"
                        columns={[...columnMetadata]}
                        rows={rows()}
                        deleteRecord={() => context.dispatch({ action: 'popup', data: { colour: 'info', message: 'Deleting tables is universally disabled for now' } })}
                        createNewRecord={createNewRecord}
                        processRowUpdate={updateRecord}
                    />
                </GlassCard>
            </div>
        </div>
    </>
}

export default TableManager