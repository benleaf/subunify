import { SheetTable } from "@/types/spreadsheet/SheetTable"
import { Chip, IconButton, Stack } from "@mui/material"
import { Cell, Worksheet } from "exceljs"
import { useContext, useEffect, useState } from "react"
import { StateMachineDispatch } from "@/App"
import { Edit } from "@mui/icons-material"
import GlassCard from "../glassmorphism/GlassCard"
import GlassSpaceBox from "../glassmorphism/GlassSpaceBox"
import { CellFormatter } from "@/helpers/CellFormatter"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { isExcelImporter } from "@/stateManagement/stateMachines/getContext"

type Props = {
    table: Partial<SheetTable>
    worksheet: Worksheet,
    tableIndex: number,
}

const TableControlWidget = ({ table, tableIndex, worksheet }: Props) => {
    const context = useContext(StateMachineDispatch)!
    if (!isExcelImporter(context)) throw new Error("TableControlWidget can only be used within the excelImporter context");
    const { dispatch } = context

    const [header, setHeader] = useState<string[]>([])
    const [body, setBody] = useState<string[][]>([[]])

    useEffect(() => {
        const headerTemp = getHeader()
        setHeader(headerTemp)
        const bodyData = getData(headerTemp)
        setBody(bodyData)
    }, [table.head, table.body])


    const getHeader = () => {
        if (!table.head) return []

        let cells: Cell[] = []
        const bottomRight = table.head.box.br
        const topLeft = table.head.box.tl

        if (topLeft.x == bottomRight.x) {
            cells = [...Array(bottomRight.y - topLeft.y + 1).keys()]
                .map(index => index + topLeft.y)
                .map(yPos => worksheet.getRow(yPos).getCell(bottomRight.x))
        } else if (topLeft.y == bottomRight.y) {
            cells = [...Array(bottomRight.x - topLeft.x + 1).keys()]
                .map(index => index + topLeft.x)
                .map(xPos => worksheet.getRow(bottomRight.y).getCell(xPos))
        }

        return cells.map(cell => CellFormatter.getHeaderCellText(cell))
    }

    const getData = (header: string[]) => {
        if (!table.body || !table.head) return [[]]

        const newBody: string[][] = header.map(_ => [])

        const bottomRight = table.body.box.br
        const topLeft = table.body.box.tl
        const headTopLeft = table.head.box.tl

        if (bottomRight.x - topLeft.x + 1 === header.length && topLeft.x == headTopLeft.x) {
            for (const key in newBody) {
                newBody[key] = [...Array(bottomRight.y - topLeft.y + 1).keys()]
                    .map(index => index + topLeft.y)
                    .map(yPos => worksheet.getRow(yPos).getCell(+key + topLeft.x))
                    .map(cell => CellFormatter.getCellText(cell))
            }
        } else if (bottomRight.y - topLeft.y + 1 === header.length && topLeft.y == headTopLeft.y) {
            for (const key in newBody) {
                newBody[key] = [...Array(bottomRight.x - topLeft.x + 1).keys()]
                    .map(index => index + topLeft.x)
                    .map(xPos => worksheet.getRow(+key + topLeft.y).getCell(xPos))
                    .map(cell => CellFormatter.getCellText(cell))
            }
        }


        return newBody
    }

    return <GlassCard marginSize="tiny" paddingSize="moderate" flex={1}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <GlassText size="large">{table.name}</GlassText>
            <div>
                <IconButton onClick={() => dispatch({ action: "editTable", data: tableIndex })}>
                    <Edit />
                </IconButton>
            </div>
        </div>
        <GlassSpaceBox>
            <Stack spacing={1} width='100%'>
                {header.slice(Math.max(header.length - 5, 0)).map((colVal, index) => <GlassCard marginSize="small" paddingSize="small">
                    <GlassSpace size="tiny">
                        <GlassText size="moderate">{colVal}</GlassText>
                        <GlassText size="small">
                            Values: {body.length == header.length && body[index].slice(Math.max(body[index].length - 2, 0)).join(', ')}
                        </GlassText>
                        <div></div>
                    </GlassSpace>
                </GlassCard>)}
                <GlassText size="moderate">
                    <Stack spacing={1} direction='row'>
                        <Chip label={`${header.length} field${header.length != 1 ? 's' : ''}`} />
                        {body[0] && <Chip label={`${body[0].length} record${body[0].length != 1 ? 's' : ''}`} />}
                    </Stack>
                </GlassText>
            </Stack>
        </GlassSpaceBox>
    </GlassCard>
}

export default TableControlWidget