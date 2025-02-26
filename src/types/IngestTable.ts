export type IngestTable = {
    name: string,
    head: {
        name: string,
        columnType: string
    }[],
    data: string[][],
}