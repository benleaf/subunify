import { Coordinate } from "./Coordinate"
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
    selectedTableCorner?: TableCorner
}