import { DisplayableTableColumn } from "./DisplayableTableColumn";
import { ServerRow } from "./ServerRow";

export type ServerTable = {
    id: string,
    name: string,
    rowCount: number,
    columns: DisplayableTableColumn[],
    rows: ServerRow[],
}