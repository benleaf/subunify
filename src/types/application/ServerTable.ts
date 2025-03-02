import { ServerColumn } from "./ServerColumn";
import { ServerRow } from "./ServerRow";

export type ServerTable = {
    id: string,
    name: string,
    rowCount: number,
    columns: ServerColumn[],
    rows: ServerRow[],
}