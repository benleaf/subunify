import { Coordinate } from "@/types/Coordinate";
import { SheetTable } from "@/types/SheetTable";
import { Cell, ValueType, Worksheet } from "exceljs";
import { DataField } from "@/types/DataField";
import { DataFormat } from "@/types/DataFormat";
import { CellFormatter } from "./CellFormatter";

export class DataTable {
    private internalColumns?: DataFormat[]
    private internalHeader?: DataField[]
    private internalBody?: DataField[][]

    constructor(private sheetTable: SheetTable, private worksheet: Worksheet) { }

    public headerCoordinateAtIndex(index: number): Partial<Coordinate> {
        const box = this.sheetTable.head?.box
        if (!box) return {}
        if (box.tl.x === box.tr.x) return { y: box.tr.y + index }
        if (box.tl.y === box.bl.y) return { x: box.tl.x + index }
        return {}
    }

    public bodyCoordinateAtIndex(fieldIndex: number, recordIndex: number): Partial<Coordinate> {
        const box = this.sheetTable.head?.box
        if (!box) return {}
        if (box.tl.x === box.tr.x) return { y: box.tr.y + fieldIndex, x: box.tl.x + recordIndex }
        if (box.tl.y === box.bl.y) return { y: box.tr.y + recordIndex, x: box.tl.x + fieldIndex }
        return {}
    }

    public get columns(): DataFormat[] | undefined {
        if (this.internalColumns?.length) return this.internalColumns
        if (!this.internalHeader) return undefined
        if (this.internalBody == undefined || this.internalBody[0].length == 0) return this.internalHeader.map(_ => ({ type: "unknown" }))

        const columns: DataFormat[] = []
        for (const headder of this.internalHeader) {
            let currentType = this.internalBody[headder.id][0].dataFormat
            for (let index = 0; index < this.internalBody[headder.id].length; index++) {
                if (this.internalBody[headder.id][index].dataFormat.type != 'unknown') {
                    currentType = this.internalBody[headder.id][index].dataFormat
                    break
                }
            }
            columns.push(currentType)
        }
        this.internalColumns = columns
        return columns
    }

    public get header() {
        if (this.internalHeader?.length) return this.internalHeader
        this.internalHeader = this.createHeader()
        return this.internalHeader
    }

    public get body() {
        if (this.internalBody && this.internalBody.length > 0 && this.internalBody[0].length > 0) return this.internalBody
        this.internalBody = this.createBody(this.header)
        return this.internalBody
    }

    private createHeader(): DataField[] {
        if (!this.sheetTable.head) return []

        let cells: Cell[] = []
        const bottomRight = this.sheetTable.head.box.br
        const topLeft = this.sheetTable.head.box.tl

        if (topLeft.x == bottomRight.x) {
            cells = [...Array(bottomRight.y - topLeft.y + 1).keys()]
                .map(index => index + topLeft.y)
                .map(yPos => this.worksheet.getRow(yPos).getCell(bottomRight.x))
        } else if (topLeft.y == bottomRight.y) {
            cells = [...Array(bottomRight.x - topLeft.x + 1).keys()]
                .map(index => index + topLeft.x)
                .map(xPos => this.worksheet.getRow(bottomRight.y).getCell(xPos))
        }

        return cells.map((cell, index) => ({
            id: index,
            dataFormat: { type: 'unknown' },
            name: this.getColumnOverideData(index) ?? CellFormatter.getHeaderCellText(cell),
            linkedCell: cell
        } as DataField))
    }

    private getColumnOverideData(headerIndex: number) {
        if (!this.sheetTable.columnOverides) return undefined
        return this.sheetTable.columnOverides[headerIndex]
    }

    private getCellDataformat(cell?: Cell): DataFormat {
        switch (cell?.type) {
            case ValueType.Boolean:
                return { type: 'boolean', options: {} }
            case ValueType.Number:
                return { type: 'number', options: {} }
            case ValueType.Date:
                return { type: 'date', options: {} }
            case ValueType.String:
                return { type: 'text', options: {} }
            case ValueType.RichText:
                return { type: 'text', options: {} }
            case ValueType.Formula:
                return { type: 'formula', options: {} }
            default:
                return { type: 'unknown' }
        }
    }

    private createBody = (header: DataField[]): DataField[][] | undefined => {
        if (!this.sheetTable.body || !this.sheetTable.head) return

        let newBody: DataField[][] | undefined = undefined

        const bottomRight = this.sheetTable.body.box.br
        const topLeft = this.sheetTable.body.box.tl
        const headTopLeft = this.sheetTable.head.box.tl

        if (bottomRight.x - topLeft.x + 1 === header.length && topLeft.x == headTopLeft.x) {
            for (const column of header) {
                const row = [...Array(bottomRight.y - topLeft.y + 1).keys()]
                    .map(index => index + topLeft.y)
                    .map(yPos => this.worksheet.getRow(yPos).getCell(column.id + topLeft.x))
                    .map((cell, index) => ({
                        id: index,
                        dataFormat: this.getCellDataformat(cell),
                        name: CellFormatter.getCellText(cell),
                        linkedCell: cell
                    } as DataField))
                newBody = [...(newBody ?? []), row]
            }
        } else if (bottomRight.y - topLeft.y + 1 === header.length && topLeft.y == headTopLeft.y) {
            for (const column of header) {
                const row = [...Array(bottomRight.x - topLeft.x + 1).keys()]
                    .map(index => index + topLeft.x)
                    .map(xPos => this.worksheet.getRow(column.id + topLeft.y).getCell(xPos))
                    .map((cell, index) => ({
                        id: index,
                        dataFormat: this.getCellDataformat(cell),
                        name: CellFormatter.getCellText(cell),
                        linkedCell: cell
                    } as DataField))
                newBody = [...(newBody ?? []), row]
            }
        }

        return newBody
    }
}