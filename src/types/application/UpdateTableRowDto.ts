export type UpdateTableRowDto = {
    rowId: string,
    values: { [columnId: string]: string }
}