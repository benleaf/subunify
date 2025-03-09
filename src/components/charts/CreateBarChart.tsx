import { Column } from '@/types/application/Column'
import { Select, InputLabel, MenuItem } from '@mui/material'
import { useEffect, useState } from 'react'
import { BarChart } from "@mui/x-charts"
import GlassText from '../glassmorphism/GlassText'
import { isError } from '@/api/isError'
import { useAuth } from '@/auth/AuthContext'

type Props = {
    tableId: string
}

const CreateBarChart = ({ tableId }: Props) => {
    const [columns, setColumns] = useState<{ all: Column[], primaryId?: string, secondaryIds?: string[] }>({ all: [] })
    const [data, setData] = useState<{ axisData: TODO, series: TODO }>()
    const { authAction } = useAuth()

    useEffect(() => {
        const getColumns = async () => {
            if (!tableId) return
            const result = await authAction<Column[]>(
                `table-column/by-table/${tableId}`,
                'GET',
            )
            if (isError(result)) {
                console.error(result.message)
            } else {
                const validColumns = result.filter(column => column.type == 'text' || column.type == 'number' || column.type == 'date')
                setColumns({ all: validColumns })
            }
        }
        getColumns()
    }, [tableId])

    const getColumnData = async (columnId: string) => {
        const result = await authAction<{ id: string, value: string, tableRow: { id: string } }[]>(
            `table-data/column-data/${columnId}`,
            'GET',
        )
        if (isError(result)) {
            console.error(result.message)
        } else {
            return result
        }
    }

    useEffect(() => {
        const getData = async () => {
            if (!columns.primaryId || !columns.secondaryIds) return
            const primaryData = await getColumnData(columns.primaryId)
            const validRows = primaryData?.sort((a, b) => a.value.localeCompare(b.value)) ?? []
            const primaryValues = validRows?.map(values => values.value) ?? []

            const SecondaryData = []
            for (const secondaryId of columns.secondaryIds ?? []) {
                const seriesData = await getColumnData(secondaryId)
                const seriesValues = validRows?.map(validRow => seriesData?.find(item => item.tableRow.id == validRow.tableRow.id)?.value ?? undefined) ?? []
                SecondaryData.push({ data: seriesValues })
            }

            console.log({ series: SecondaryData, axisData: [{ data: primaryValues, scaleType: 'band' }] })
            setData({ series: SecondaryData, axisData: [{ data: primaryValues, scaleType: 'band' }] })
        }
        getData()
    }, [columns.primaryId, columns.secondaryIds])

    return <>
        <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', flex: 1, padding: 10 }}>
                <GlassText size="moderate">Primary Column</GlassText>
                <Select
                    label="Tables"
                    onChange={event => setColumns({ ...columns, primaryId: event.target.value as string })}
                >
                    <InputLabel>Primary Column</InputLabel>
                    {columns.all?.map(column => <MenuItem value={column.id}>{column.name}</MenuItem>)}
                </Select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', flex: 1, padding: 10 }}>
                <GlassText size="moderate">Secondary Columns</GlassText>
                <Select
                    label="Tables"
                    multiple
                    value={columns.secondaryIds ?? []}
                    onChange={event => setColumns({ ...columns, secondaryIds: event.target.value as string[] })}
                >
                    <InputLabel>Secondary Columns</InputLabel>
                    {columns.all?.map(column => <MenuItem value={column.id}>{column.name}</MenuItem>)}
                </Select>
            </div>
        </div>
        {data &&
            <BarChart
                xAxis={data.axisData}
                series={data.series}
                width={1000}
                height={300}
            />
        }
    </>
}

export default CreateBarChart