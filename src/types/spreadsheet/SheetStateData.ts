import { Coordinate } from "./Coordinate"
import { FlowStates } from "./FlowStates"
import { SheetTable } from "./SheetTable"
import { TableCorner } from "./TableCorner"

export type SheetStateData = {
    scroll: Coordinate
    mousePossition: Coordinate
    selectedTableIndex?: number
    tables: SheetTable[]
    resizeAncorPossition?: Coordinate
    selectedCell?: Coordinate
    worksheetId: number
    scrollAcceleration?: number
    loading?: boolean
    selectedTableCorner?: TableCorner
    flowState: FlowStates
}