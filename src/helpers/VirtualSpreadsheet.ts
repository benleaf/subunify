import { Dimension } from "@/types/Dimension";
import { Cell, Worksheet } from "exceljs";
import { CellFormatter } from "./CellFormatter";

export class VirtualSpreadsheet {
    private table: string[][] = []

    constructor(private worksheet: Worksheet, private tableLimits: Dimension) { }

    public getTable(): string[][] {
        if (this.table.length + 1 !== this.tableLimits.height || this.table[0].length + 1 !== this.tableLimits.width) {
            this.table = this.createTable()
        }
        return this.table
    }

    public getTableLimits(): Dimension {
        return this.tableLimits
    }

    public resizeTable(newLimits: Dimension) {
        this.tableLimits = {
            width: Math.max(newLimits.width, this.tableLimits.width),
            height: Math.max(newLimits.height, this.tableLimits.height)
        }

        if (this.table.length + 1 !== this.tableLimits.height || this.table[0].length + 1 !== this.tableLimits.width) {
            this.table = this.createTable()
        }

        return this
    }

    private getCell(row: number, col: number): Cell | undefined {
        return this.worksheet.getRow(row).getCell(col)
    }

    private createTable(): string[][] {
        const table: string[][] = []
        for (let row = 1; row < this.tableLimits.height; row++) {
            const tableRow: string[] = []
            for (let col = 1; col < this.tableLimits.width; col++) {
                const cell = this.getCell(row, col)
                tableRow.push(cell ? CellFormatter.getCellText(cell) : '')
            }
            table.push(tableRow)
        }
        return table
    }
}