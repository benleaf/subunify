import { DataFormat } from "../DataFormat";

export type DisplayableTableColumn = {
    id: string,
    field: string,
    type: DataFormat['type'],
    headerName: string,
    width: number,
    editable: boolean,
    hideable: boolean,
}