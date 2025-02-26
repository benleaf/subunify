import { ApplicationDispatch } from "@/pages/Dashboard"
import { DataGrid } from "@mui/x-data-grid"
import { useContext, } from "react"


const TablesTable = () => {
    const { state } = useContext(ApplicationDispatch)!

    const columnsWithoutType = state.selectedTable?.columns.map(column => column.type == 'date' ? ({
        ...column, valueFormatter: (dateString: string | undefined) => dateString && (new Date(dateString)).toLocaleString()
    }) : column)

    return columnsWithoutType && <DataGrid
        columns={columnsWithoutType}
        rows={state.selectedTable?.rows ?? []}
        pagination
        initialState={{
            density: 'compact'
        }}
    />
}

export default TablesTable