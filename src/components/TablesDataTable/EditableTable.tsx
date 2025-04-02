import { Add, Cancel, Delete, Edit, Save } from "@mui/icons-material"
import { Button, Divider, Stack } from "@mui/material"
import { GridActionsCellItem, GridColDef, GridColumnOrderChangeParams, GridColumnResizeParams, GridColumnVisibilityModel, GridDensity, GridEventListener, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridRowsProp, GridSlotProps, GridToolbarContainer, GridValidRowModel } from "@mui/x-data-grid"
import { useState, } from "react"
import BaseModal from "../modal/BaseModal"
import GlassSpace from "../glassmorphism/GlassSpace"
import { DataGridPro, GridToolbar } from "@mui/x-data-grid-pro"
import GlassText from "../glassmorphism/GlassText"
import ColumnForm from "./ColumnForm"
import { Time } from "@/helpers/Time"

declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
        setRowModesModel: (
            newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
        ) => void
    }
}

type EditModalProps =
    { state: 'open', selectedFieldId: string, action: 'delete' } |
    { state: 'open', action: 'create' } |
    { state: 'closed' }

type Props = {
    style?: React.CSSProperties
    name?: string,
    defaultDensity?: GridDensity,
    columns: GridColDef[]
    rows: { [key: string]: any }[],
    deleteRecord: (id: string) => void,
    processRowUpdate: (params: GridRowModel) => GridValidRowModel | Promise<GridValidRowModel>
    createNewRecord?: (record: { [key: string]: any }) => void,
}

const EditableTable = ({ style, name, columns, rows, deleteRecord, createNewRecord, processRowUpdate, defaultDensity = 'comfortable' }: Props) => {
    const [modalState, setModalState] = useState<EditModalProps>({ state: 'closed' })
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

    const EditToolbar = (props: GridSlotProps['toolbar']) =>
        <GridToolbarContainer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
                <GridToolbar {...props} />
            </div>
            {createNewRecord &&
                <Button startIcon={<Add />} onClick={() => setModalState({ state: 'open', action: 'create' })}>
                    Add {name ?? 'Record'}
                </Button>
            }
        </GridToolbarContainer>

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

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel)
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

    const onCreateNewRecord = (record: { [key: string]: any }) => {
        createNewRecord && createNewRecord(record)
        setModalState({ state: 'closed' })
    }

    const onDeleteRecord = () => {
        if (modalState.state == 'open' && modalState.action == 'delete') {
            deleteRecord(modalState.selectedFieldId)
        }
        setModalState({ state: 'closed' })
    }

    const onColumnResize = (params: GridColumnResizeParams) => {
        localStorage.setItem(`colWidth:${params.colDef.field}:${name}`, `${params.width}`)
    }

    const onColumnVisibilityModelChange = (params: GridColumnVisibilityModel) => {
        localStorage.setItem(`colVisibility:${name}`, JSON.stringify(params))
    }

    const getColumnVisibility = (): GridColumnVisibilityModel | undefined => {
        const visibility = localStorage.getItem(`colVisibility:${name}`)
        if (visibility) return JSON.parse(visibility)
    }

    const onColumnOrderChange = (params: GridColumnOrderChangeParams) => {
        let order: (string | undefined)[] = getColumnOrder()

        if (params.targetIndex >= order.length) {
            var k = params.targetIndex - order.length + 1;
            while (k--) {
                order.push(undefined);
            }
        }
        order.splice(params.targetIndex, 0, order.splice(params.oldIndex, 1)[0]);
        localStorage.setItem(`colOrder:${name}`, JSON.stringify(order))
    }

    const getColumnOrder = (): string[] => {
        const orderJsonString = localStorage.getItem(`colOrder:${name}`)

        if (orderJsonString) {
            return JSON.parse(orderJsonString)
        } else {
            return columns.map(column => column.field ?? '')
        }
    }

    const getFormattedColumns = (): GridColDef[] => {
        const formattedColumns = []

        for (const column of columns) {
            const columnWidth = localStorage.getItem(`colWidth:${column.field}:${name}`)
            if (columnWidth != null) column.width = +columnWidth
            const sortingOrders = getColumnOrder()
            const sortingOrder = sortingOrders.indexOf(column.field)

            if (column.type == 'date') {
                column.valueFormatter = (dateString?: string) => dateString ? Time.format(dateString) : ''
            }
            formattedColumns.push({
                ...column,
                customSortingOrder: sortingOrder
            })
        }

        const sortedColumns = formattedColumns.sort((a, b) => a.customSortingOrder - b.customSortingOrder)

        return sortedColumns.map(({ customSortingOrder, ...columnData }) => columnData)
    }

    return <>
        <DataGridPro
            style={style}
            columns={[...getFormattedColumns(), columnActions]}
            rows={rows}
            pagination
            initialState={{
                density: defaultDensity,
                pinnedColumns: { right: ['actions'] },
                columns: {
                    columnVisibilityModel: getColumnVisibility()
                }
            }}
            editMode="row"
            getRowHeight={params => params.densityFactor > 1 ? 'auto' : undefined}
            onColumnResize={onColumnResize}
            onColumnVisibilityModelChange={onColumnVisibilityModelChange}
            onColumnOrderChange={onColumnOrderChange}
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            onProcessRowUpdateError={console.error}
            processRowUpdate={processRowUpdate}
            slots={{ toolbar: EditToolbar }}
        />
        <BaseModal state={modalState.state} close={() => setModalState({ state: 'closed' })}>
            <GlassSpace size="large">
                {modalState.state == 'open' && modalState.action == 'delete' &&
                    <Stack direction='column' spacing={2}>
                        <GlassText size="large">
                            Are you sure you wish to perform this ({modalState.state == 'open' && modalState.action}) action?
                        </GlassText>
                        <Divider />
                        <Stack direction='row' spacing={2}>
                            <Button style={{ flex: 1 }} variant="outlined" onClick={onDeleteRecord}>Yes</Button>
                            <Button style={{ flex: 1 }} variant="contained" onClick={() => setModalState({ state: 'closed' })}>No</Button>
                        </Stack>
                    </Stack>
                }
                {modalState.state == 'open' && modalState.action == 'create' &&
                    <Stack direction='column' spacing={2}>
                        <GlassText size="moderate">Create {name ?? 'Row'}</GlassText>
                        <ColumnForm columns={getFormattedColumns()} onSubmit={onCreateNewRecord} />
                    </Stack>
                }
            </GlassSpace>
        </BaseModal>
    </>
}

export default EditableTable