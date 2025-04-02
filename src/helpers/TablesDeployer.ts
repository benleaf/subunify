import { IngestTable } from "@/types/IngestTable";
import { SheetTable } from "@/types/spreadsheet/SheetTable";
import { Worksheet } from "exceljs";
import { DataTable } from "./DataTable";
import { apiAction } from "@/api/apiAction";

export class TablesDeployer {
    public static deployFromLocalStore() {
        const tables = localStorage.getItem("deploymentTables")
        if (tables) {
            console.log(tables)
            const result = apiAction('ingest', 'POST', tables)
            localStorage.removeItem("deploymentTables")
            return result
        }
    }

    public static confirmSuccessfulStore() {
        const tables = localStorage.getItem("deploymentTables")
        return !!tables
    }

    public static saveToLocalStore(tables: SheetTable[], worksheets: Worksheet[]) {
        const ingestTables: IngestTable[] = []
        for (const table of tables) {
            const tableWorksheet = worksheets[table.parentWorksheetId]
            const dataTable = new DataTable(table, tableWorksheet)
            const headings = TablesDeployer.getHeadFromDataTable(dataTable)
            ingestTables.push({
                data: TablesDeployer.getDataFromDataTable(dataTable),
                head: headings,
                name: table.name
            })
        }

        return TablesDeployer.saveTable(ingestTables)
    }

    private static getHeadFromDataTable(dataTable: DataTable) {
        return dataTable.header
            .map((heading, index) => ({
                name: heading.name,
                removed: heading.removed,
                columnType: (dataTable.columns ? dataTable.columns[index].type : 'unknown')
            }))
            .filter(heading => !heading.removed)
    }

    private static getDataFromDataTable(dataTable: DataTable) {
        if (!dataTable.body) return [[]]
        const data: string[][] = [[]]
        let filteredColumnIndex = 0

        for (let columnIndex = 0; columnIndex < dataTable.body.length; columnIndex++) {
            if (dataTable.header[columnIndex].removed) continue

            for (let rowIndex = 0; rowIndex < dataTable.body[filteredColumnIndex].length; rowIndex++) {
                if (typeof data[rowIndex] === 'undefined') data[rowIndex] = []
                if (dataTable.columns && dataTable.columns[columnIndex].type == 'formula') break

                data[rowIndex][filteredColumnIndex] = dataTable.body[filteredColumnIndex][rowIndex].name
            }

            filteredColumnIndex++
        }

        return data
    }

    private static saveTable(ingestTables: IngestTable[]) {
        localStorage.setItem("deploymentTables", JSON.stringify({ tables: ingestTables }));
    }
}