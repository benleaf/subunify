import { TableDataResult } from "./TableDataResult"

export type UpdateTableRowResult = {
    rowData: Promise<TableDataResult[]>;
    modified: Date;
    rowId: string;
}