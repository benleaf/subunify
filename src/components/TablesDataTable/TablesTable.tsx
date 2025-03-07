import { Add, Cancel, Delete, Edit, Save } from "@mui/icons-material"
import { Button, Divider, Stack } from "@mui/material"
import { GridActionsCellItem, GridColDef, GridEventListener, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridRowsProp, GridSlotProps, GridToolbarContainer } from "@mui/x-data-grid"
import { useContext, useState, } from "react"
import BaseModal from "../modal/BaseModal"
import GlassSpace from "../glassmorphism/GlassSpace"
import { DataGridPro, GridToolbar } from "@mui/x-data-grid-pro"
import { ServerRow } from "@/types/application/ServerRow"
import { UpdateTableRowResult } from "@/types/server/UpdateTableRowResult"
import { apiAction } from "@/api/apiAction"
import { ServerColumn } from "@/types/application/ServerColumn"
import GlassText from "../glassmorphism/GlassText"
import { isError } from "@/api/getResource"
import { StateMachineDispatch } from "@/App"
import { isDashboard } from "@/stateManagement/stateMachines/getContext"


declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
        setRowModesModel: (
            newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
        ) => void
    }
}

type EditModalProps = { state: 'open', selectedFieldId: string, action: 'delete' } | { state: 'closed' }

const TablesTable = () => {
    const context = useContext(StateMachineDispatch)!
    if (!isDashboard(context)) throw new Error("TablesTable can only be used within the dashboard context");
    const { dispatch, state } = context

    const [modalState, setModalState] = useState<EditModalProps>({ state: 'closed' })
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
    const rows: ServerRow[] = state.data.selectedTable?.rows ?? []
    const columns: ServerColumn[] = state.data.selectedTable?.columns ?? []

    function EditToolbar(props: GridSlotProps['toolbar']) {

        return <GridToolbarContainer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <GridToolbar {...props} />
            <Button startIcon={<Add />} onClick={createNewRecord}>
                Add record
            </Button>
        </GridToolbarContainer>
    }

    const createNewRecord = async () => {
        const newRow = await apiAction<ServerRow>(
            `table-row`,
            'POST',
            JSON.stringify({
                tableId: state.data.selectedTable?.id,
            })
        )

        if (newRow.message) {
            console.error(newRow.message)
            dispatch({ action: 'popup', data: { colour: 'error', message: 'Unable to create record' } })
        } else {
            setRows([...state.data.selectedTable?.rows ?? [], newRow])
            dispatch({ action: 'popup', data: { colour: 'success', message: 'Record created' } })
        }
    }

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true
        }
    }

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
    }

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
    }

    const handleDeleteClick = (id: GridRowId) => () => {
        setModalState({ state: 'open', selectedFieldId: id as string, action: 'delete' })
    }

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        })
    }

    const updateRemoteRows = async (rowId: string, values: { [key: string]: string }) => {
        return apiAction<UpdateTableRowResult>(
            `table-row`,
            'PATCH',
            JSON.stringify({ rowId, values })
        )
    }

    const processRowUpdate = async (newRow: GridRowModel) => {
        const valuesMap = new Map<string, string>()

        for (const columnName of Object.keys(newRow)) {
            const value = newRow[columnName];
            const columnId = columns.find(column => column.field == columnName)?.id
            const oldRow = rows.find(row => row.id == newRow.id)
            const dontSend = !columnId || !oldRow || oldRow[columnName] == value
            const notNullValue = value === null ? '' : value

            if (!dontSend) valuesMap.set(columnId, notNullValue)
        }

        const result = await updateRemoteRows(newRow.id, Object.fromEntries(valuesMap))

        if (isError(result)) {
            console.error(result.message)
            dispatch({ action: 'popup', data: { colour: 'error', message: 'Unable to update record' } })
            return
        }

        const newRowWithModified: GridRowModel & { modified: Date } = { ...newRow, modified: result.modified }
        setRows(rows.map((row) => (row.id === newRowWithModified.id ? newRowWithModified as ServerRow : row)))
        dispatch({ action: 'popup', data: { colour: 'success', message: 'Record Updated' } })

        return newRowWithModified
    }

    const setRows = (newRows: ServerRow[]) => {
        dispatch({ action: 'setSelectedTableRows', data: newRows })
    }

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        console.error("handleRowModesModelChange")
        setRowModesModel(newRowModesModel)
    }

    const performModalAction = async () => {
        if (modalState.state != 'open') return

        if (modalState.action == 'delete') {
            const result = await apiAction<UpdateTableRowResult>(
                `table-row/${modalState.selectedFieldId}`,
                'DELETE',
            )

            if ('message' in result) {
                console.log(result.message)
                dispatch({ action: 'popup', data: { colour: 'error', message: 'Unable to delete record' } })
            } else {
                setRows(rows.filter((row) => row.id !== modalState.selectedFieldId));
                setModalState({ state: 'closed' })
                dispatch({ action: 'popup', data: { colour: 'success', message: 'Record Deleted' } })
            }
        }
    }

    const columnActions: GridColDef = {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        filterable: false,
        hidable: false,
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

            if (isInEditMode) {
                return [
                    <GridActionsCellItem
                        icon={<Save />}
                        label="Save"
                        sx={{
                            color: 'primary.main',
                        }}
                        onClick={handleSaveClick(id)}
                    />,
                    <GridActionsCellItem
                        icon={<Cancel />}
                        label="Cancel"
                        className="textPrimary"
                        onClick={handleCancelClick(id)}
                        color="inherit"
                    />,
                ]
            }

            return [
                <GridActionsCellItem
                    icon={<Edit />}
                    label="Edit"
                    className="textPrimary"
                    onClick={handleEditClick(id)}
                    color="inherit"
                />,
                <GridActionsCellItem
                    icon={<Delete />}
                    label="Delete"
                    onClick={handleDeleteClick(id)}
                    color="inherit"
                />,
            ]
        },
    }

    const columnMetadata: GridColDef[] = [
        {
            field: 'id',
            type: 'string',
            headerName: 'ID',
            hidable: false,
            width: 100,
        },
        {
            field: 'created',
            type: 'string',
            headerName: 'Created',
            width: 100,
        },
        {
            field: 'modified',
            type: 'string',
            headerName: 'Last Modified',
            width: 100,
        },
    ]

    const cleanedColumnData = state.data.selectedTable?.columns.map(column => column.type == 'date' ? ({
        ...column, valueFormatter: (dateString: string | undefined) => dateString && (new Date(dateString)).toLocaleString()
    }) : column) as GridColDef[] | undefined

    return cleanedColumnData && <>
        <DataGridPro
            columns={[...columnMetadata, ...cleanedColumnData, columnActions]}
            rows={state.data.selectedTable?.rows ?? []}
            pagination
            initialState={{
                density: 'compact',
                pinnedColumns: { right: ['actions'], left: ['id'] }
            }}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            onProcessRowUpdateError={console.error}
            processRowUpdate={processRowUpdate}
            slots={{ toolbar: EditToolbar }}
        />
        <BaseModal state={modalState.state} close={() => setModalState({ state: 'closed' })}>
            <GlassSpace size="large">
                <Stack direction='column' spacing={2}>
                    <GlassText size="large">
                        Are you sure you wish to perform this ({modalState.state == 'open' && modalState.action}) action?
                    </GlassText>
                    <Divider />
                    <Stack direction='row' spacing={2}>
                        <Button style={{ flex: 1 }} variant="outlined" onClick={performModalAction}>Yes</Button>
                        <Button style={{ flex: 1 }} variant="contained" onClick={() => setModalState({ state: 'closed' })}>No</Button>
                    </Stack>
                </Stack>
            </GlassSpace>
        </BaseModal>
    </>
}

export default TablesTable