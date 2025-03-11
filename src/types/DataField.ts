import { Cell } from "exceljs";
import { DataFormat } from "./DataFormat";

export type DataField = {
    localIndex: number,
    globalIndex: number,
    name: string,
    description?: string,
    dataFormat: DataFormat,
    linkedCell: Cell
    removed: boolean
}