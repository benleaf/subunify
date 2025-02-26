import { TableResult } from "@/types/server/TableResult"
import { Select, InputLabel, MenuItem } from "@mui/material"
import { useState } from "react"
import CreateLineChart from "./CreateLineChart"
import CreateBarChart from "./CreateBarChart"
import GlassText from "../glassmorphism/GlassText"

type Props = {
    tables: TableResult[]
}

const CreateChartForm = ({ tables }: Props) => {
    const [tableId, setTableId] = useState<string | undefined>(tables.length > 0 ? tables[0].id : undefined)
    const [chartType, setChartType] = useState<'line' | 'bar'>('line')

    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', flex: 1, padding: 10 }}>
                <GlassText size="modrate">Table</GlassText>
                <Select
                    value={tableId}
                    label="Tables"
                    onChange={event => setTableId(event.target.value)}
                >
                    <InputLabel>Select Table</InputLabel>
                    {tables.map(table => <MenuItem value={table.id}>{table.name}</MenuItem>)}
                </Select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', flex: 1, padding: 10 }}>
                <GlassText size="modrate">Table Type</GlassText>
                <Select
                    value={chartType}
                    label="Chart Type"
                    onChange={event => setChartType(event.target.value as typeof chartType)}
                >
                    <MenuItem value='line'>line</MenuItem>
                    <MenuItem value='bar'>bar</MenuItem>
                </Select>
            </div>
        </div>

        {tableId && chartType === 'line' && <CreateLineChart tableId={tableId} />}
        {tableId && chartType === 'bar' && <CreateBarChart tableId={tableId} />}
    </div>
}

export default CreateChartForm