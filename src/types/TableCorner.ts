import { Corner } from "./Corner"
import { SheetTable } from "./SheetTable"

export type TableCorner = {
    tableElement: Extract<keyof SheetTable, 'head' | 'body'>,
    corner: Corner
} 