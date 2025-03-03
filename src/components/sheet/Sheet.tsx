import { Worksheet } from "exceljs"
import SheetCell from "./SheetCell"
import { ElementRef, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { SheetTable } from "@/types/spreadsheet/SheetTable"
import { StateMachineDispatch } from "./SheetTabs"
import { Dimension } from "@/types/spreadsheet/Dimension"
import { CellFormatter } from "../../helpers/CellFormatter"
import { Coordinate } from "@/types/spreadsheet/Coordinate"
import ScrollableTableContainer from "./ScrollableTableContainer"
import tableStyle from './table.module.css';
import { BoundingBox } from "@/helpers/BoundingBox"
import GlassText from "../glassmorphism/GlassText"

type Props = {
    sheetTables: SheetTable[]
    possition: Coordinate,
    worksheet?: Worksheet
    selectedTableIndex?: number,
    worksheetId?: number,
}

const Sheet = ({ sheetTables, possition, worksheet, worksheetId, selectedTableIndex }: Props) => {
    const { dispatch } = useContext(StateMachineDispatch)!

    const getCellByDisplayCoord = (x: number, y: number) => worksheet?.getRow(getGlobalY(y)).getCell(getGlobalX(x))
    const getGlobalX = (x: number) => x + Math.floor(possition.x)
    const getGlobalY = (y: number) => y + Math.floor(possition.y)

    const getTableBoundingBox = (
        globalX: number,
        globalY: number,
        table: SheetTable
    ): { box: BoundingBox, type: 'head' | 'body' } | undefined =>
        table.body?.inBoundingBox({ x: globalX, y: globalY }) ? { box: table.body, type: 'body' } : (
            table.head?.inBoundingBox({ x: globalX, y: globalY }) ? { box: table.head, type: 'head' } : undefined
        )

    const getBoundingBox = (globalX: number, globalY: number) => sheetTables
        .map((table, index) => ({
            parentWorksheetId: table.parentWorksheetId,
            tableId: index,
            ...getTableBoundingBox(globalX, globalY, table)
        }))
        .filter(table => table.parentWorksheetId == worksheetId)
        .filter(table => table.box).pop()

    const isCorner = (x: number, y: number) => {
        return sheetTables
            .filter((_, index) => index == selectedTableIndex)
            .filter(table => table.parentWorksheetId == worksheetId)
            .some(
                table => table.body?.getCorner({ x, y }) || table.head?.getCorner({ x, y })
            )
    }

    const defaultCellStyles: React.CSSProperties = {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderStyle: 'solid',
    }

    const getBoxedCellData = (x: number, y: number) => {
        const boxData = getBoundingBox(x, y)
        const boundingBoxStyles = boxData?.box?.getCellStyles({ x, y }, boxData?.tableId == selectedTableIndex)

        return {
            styles: boundingBoxStyles ?? defaultCellStyles,
            boxIndex: boxData?.box?.getCellIndex({ x, y }),
            type: boxData?.type
        }
    }

    const boundingBoxCornerHit = (x: number, y: number) => {
        if (selectedTableIndex === undefined) return
        const table = sheetTables[selectedTableIndex]
        const body = table?.body?.getCorner({ x, y })
        const head = table?.head?.getCorner({ x, y })
        if (body) {
            dispatch({ action: "dragSelectedTableCorner", data: { tableElement: 'body', corner: body } })
        } else if (head) {
            dispatch({ action: "dragSelectedTableCorner", data: { tableElement: 'head', corner: head } })
        }
    }

    const getTableCellDisplayData = (x: number, y: number) => {
        const cell = getCellByDisplayCoord(x, y)
        const cellData = getBoxedCellData(getGlobalX(x), getGlobalY(y))
        let cellName = cell ? CellFormatter.getCellText(cell) : ''

        if (selectedTableIndex !== undefined && cellData.boxIndex !== undefined && cellData.type == 'head') {
            const table = sheetTables[selectedTableIndex]
            if (table.columnOverides && table.columnOverides[cellData.boxIndex])
                cellName = table.columnOverides[cellData.boxIndex]
        }

        return {
            cell,
            value: cellName,
            style: cellData.styles,
            cornerVisible: isCorner(getGlobalX(x), getGlobalY(y))
        }
    }

    const tableContainerRef = useRef<ElementRef<'div'>>(null)
    const firstCellRef = useRef<ElementRef<'td'>>(null)

    const defaultCellDimension = { width: 150, height: 40 }
    const [firstCellDimension, setFirstCellDimension] = useState<Dimension>(defaultCellDimension)
    const screenDimension = tableContainerRef.current?.getBoundingClientRect() ?? { width: 0, height: 0 }

    const visibleRows = [...Array(Math.floor(screenDimension.height / defaultCellDimension.height + 1)).keys()]
    const visibleCols = [...Array(Math.floor(screenDimension.width / defaultCellDimension.width) + 1).keys()]

    const tableRerenderDependencies = [
        Math.floor(possition.x),
        Math.floor(possition.y),
        worksheetId,
        sheetTables,
        selectedTableIndex !== undefined && sheetTables[selectedTableIndex].columnOverides,
        screenDimension
    ]

    const displayableGrid = useMemo(
        () => visibleRows.map(y => visibleCols.map(x => getTableCellDisplayData(x, y))),
        tableRerenderDependencies
    )

    // triger initial render, this is bad practice and another method should be found: TODO
    useEffect(() => dispatch({ action: "mouseMoved", data: { x: 10, y: 10 } }), [])


    const hiddenOverlapX = -(possition.x - Math.floor(possition.x)) * firstCellDimension.width
    const hiddenOverlapY = -(possition.y - Math.floor(possition.y)) * firstCellDimension.height

    useLayoutEffect(() => {
        if (firstCellRef.current) setFirstCellDimension(firstCellRef.current.getBoundingClientRect())
    }, [getGlobalX(0), getGlobalY(0)])

    return <ScrollableTableContainer tableRef={tableContainerRef}>
        <tbody
            style={{
                position: "relative",
                left: hiddenOverlapX,
                top: hiddenOverlapY
            }}
        >
            {displayableGrid?.map((rows, y) =>
                <tr key={y} style={{ maxHeight: 10, margin: 0, padding: 0 }}>
                    <td className={tableStyle.tableSideAxis} >
                        <GlassText size="small">
                            {getGlobalY(y)}
                        </GlassText>
                    </td>
                    {rows.map((cellDisplayData, x) => <SheetCell
                        key={x}
                        cornerVisible={cellDisplayData.cornerVisible}
                        value={cellDisplayData.value}
                        {...(x == 0 && y == 0 ? { innerRef: firstCellRef } : {})}
                        style={cellDisplayData.style}
                        onMouseEnter={() => cellDisplayData.cell && dispatch({ action: "cellSelected", data: { x: getGlobalX(x), y: getGlobalY(y) } })}
                        onCornerMouseDown={_ => boundingBoxCornerHit(getGlobalX(x), getGlobalY(y))}
                    />)}
                </tr>
            )}
        </tbody>
        <thead
            style={{
                position: "relative",
                left: hiddenOverlapX,
            }}
        >
            <tr>
                <td className={tableStyle.tableCorner}></td>
                {visibleCols.map(x => <td className={tableStyle.tableTopAxis} key={x} >
                    <GlassText size="small">
                        {getGlobalX(x)}
                    </GlassText>
                </td>)}
            </tr>
        </thead>
    </ScrollableTableContainer>
}

export default Sheet