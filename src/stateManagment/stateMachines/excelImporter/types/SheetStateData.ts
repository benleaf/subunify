import { Coordinate } from "@/types/spreadsheet/Coordinate"
import { FlowStates } from "@/types/spreadsheet/FlowStates"
import { SheetTable } from "@/types/spreadsheet/SheetTable"
import { TableCorner } from "@/types/spreadsheet/TableCorner"
import { Worksheet } from "exceljs"

export type SheetStateData = {
    machine: 'excelImporter',
    scroll: Coordinate
    mousePossition: Coordinate
    selectedTableIndex?: number
    tables: SheetTable[]
    worksheets?: Worksheet[]
    resizeAncorPossition?: Coordinate
    selectedCell?: Coordinate
    worksheetId: number
    scrollAcceleration?: number
    selectedTableCorner?: TableCorner
    flowState: FlowStates
}