import { Coordinate } from "@/types/spreadsheet/Coordinate"
import { FlowStates } from "@/types/spreadsheet/FlowStates"
import { SheetTable } from "@/types/spreadsheet/SheetTable"
import { TableCorner } from "@/types/spreadsheet/TableCorner"
import { Worksheet } from "exceljs"
import { CSSProperties } from "react"

export type SheetStateData = {
    machine: 'excelImporter',
    scroll: Coordinate
    cursor?: CSSProperties['cursor']
    mousePosition: Coordinate
    selectedTableIndex?: number
    tables: SheetTable[]
    worksheets?: Worksheet[]
    resizeAncorPossition?: Coordinate
    selectedCell?: Coordinate
    worksheetId: number
    touchScreenOnly?: boolean
    scrollAcceleration?: number
    selectedTableCorner?: TableCorner
    flowState: FlowStates
}