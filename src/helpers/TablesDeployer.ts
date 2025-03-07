import { IngestTable } from "@/types/IngestTable";
import { SheetTable } from "@/types/spreadsheet/SheetTable";
import { Worksheet } from "exceljs";
import { DataTable } from "./DataTable";
import { apiAction } from "@/api/apiAction";

export class TablesDeployer {
    public static deployFromLocalStore() {
        const tables = localStorage.getItem("deploymentTables")
        if (tables) {
            const result = apiAction('ingest', 'POST', tables)
            localStorage.removeItem("deploymentTables")
            return result
        }
    }

    public static saveToLocalStore(tables: SheetTable[], worksheets: Worksheet[]) {
        const ingestTables: IngestTable[] = []
        for (const table of tables) {
            const tableWorksheet = worksheets[table.parentWorksheetId]
            const dataTable = new DataTable(table, tableWorksheet)
            ingestTables.push({
                data: TablesDeployer.getDataFromDataTable(dataTable),
                head: TablesDeployer.getHeadFromDataTable(dataTable),
                name: table.name
            })
        }

        return TablesDeployer.deployTable(ingestTables)
    }

    private static getHeadFromDataTable(dataTable: DataTable) {
        return dataTable.header.map((headding, index) => ({
            name: headding.name,
            columnType: dataTable.columns ? dataTable.columns[index].type : 'unknown'
        }))
    }

    private static getDataFromDataTable(dataTable: DataTable) {
        if (!dataTable.body) return [[]]
        const data: string[][] = [[]]

        for (let columnIndex = 0; columnIndex < dataTable.body.length; columnIndex++) {
            for (let rowIndex = 0; rowIndex < dataTable.body[columnIndex].length; rowIndex++) {
                if (typeof data[rowIndex] === 'undefined') data[rowIndex] = []
                data[rowIndex][columnIndex] = dataTable.body[columnIndex][rowIndex].name
            }
        }

        return data
    }

    private static deployTable(ingestTables: IngestTable[]) {
        localStorage.setItem("deploymentTables", JSON.stringify({ tables: ingestTables }));
    }
}