import { SheetTable } from "@/types/SheetTable"
import { Button, Card, Chip, IconButton, Input, Paper, Stack } from "@mui/material"
import { Cell, Worksheet } from "exceljs"
import { useContext, useEffect, useState } from "react"
import { StateMachineDispatch } from "../sheet/SheetTabs"
import { Edit } from "@mui/icons-material"

type Props = {
    table: Partial<SheetTable>
    worksheet: Worksheet,
    tableIndex: number,
}

const TableControlWidget = ({ table, tableIndex, worksheet }: Props) => {
    const dispatch = useContext(StateMachineDispatch)!
    const [header, setHeader] = useState<string[]>([])
    const [body, setBody] = useState<string[][]>([[]])

    useEffect(() => {
        const headderTemp = getHeadder()
        setHeader(headderTemp)
        const bodyData = getData(headderTemp)
        setBody(bodyData)
    }, [table.head, table.body])


    const getHeadder = () => {
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

        return cells.map(cell => JSON.stringify(cell?.value))
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
                    .map(cell => JSON.stringify(cell?.value))
            }
        } else if (bottomRight.y - topLeft.y + 1 === header.length && topLeft.y == headTopLeft.y) {
            for (const key in newBody) {
                newBody[key] = [...Array(bottomRight.x - topLeft.x + 1).keys()]
                    .map(index => index + topLeft.x)
                    .map(xPos => worksheet.getRow(+key + topLeft.y).getCell(xPos))
                    .map(cell => JSON.stringify(cell?.value))
            }
        }


        return newBody
    }

    return <Card component={Paper} sx={{ margin: '0.5em', padding: '1em', width: '20em' }}>
        <Stack spacing={1}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>{table.name}</h2>
                <div>
                    <IconButton onClick={() => dispatch({ action: "editTable", data: tableIndex })}>
                        <Edit />
                    </IconButton>
                </div>
            </div>
            <Stack spacing={1} direction='row'>
                <Chip label={`${header.length} field${header.length != 1 ? 's' : ''}`} />
                {body[0] && <Chip label={`${body[0].length} record${body[0].length != 1 ? 's' : ''}`} />}
            </Stack>

            {header.slice(Math.max(header.length - 5, 0)).map((colVal, index) => <Card sx={{ padding: '0.5em' }}>
                <div>{colVal}</div>
                <div>Values: {body.length == header.length && body[index].slice(Math.max(body[index].length - 2, 0)).join(', ')}</div>
            </Card>)}
        </Stack>
    </Card>
}

export default TableControlWidget