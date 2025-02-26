export type Table = {
    id: string,
    name: string,
    rowCount: number,
    columns: {
        id: string,
        field: string,
        type: string,
        headerName: string,
        width: number,
        editable: boolean,
        hideable: boolean,
    }[],
    rows: { [key in string]: string | number }[],
}