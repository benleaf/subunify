import { Cell } from "exceljs";
import { DataFormat } from "./DataFormat";

export type DataField = {
    id: number,
    name: string,
    description?: string,
    dataFormat: DataFormat,
    linkedCell: Cell
}