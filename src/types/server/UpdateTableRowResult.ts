import { ServerRow } from "../application/ServerRow";

export type UpdateTableRowResult = {
    rowData: ServerRow[];
    modified: Date;
    rowId: string;
}