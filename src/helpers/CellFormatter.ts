import { Cell, CellFormulaValue, CellRichTextValue, CellValue, ValueType } from "exceljs";

export class CellFormatter {
    public static getHeaderCellText(cell: Cell): string {
        if (cell.type === ValueType.String) {
            return cell.value as string
        } else if (CellFormatter.isRichText(cell.value)) {
            return CellFormatter.handleRichText(cell.value)
        }
        return 'ERROR'
    }

    public static getCellText(cell: Cell): string {
        switch (cell.type) {
            case ValueType.Boolean:
                return !!cell.value ? "true" : "false"
            case ValueType.Number:
                return (cell.value as number).toFixed(1)
            case ValueType.Date:
                return (new Date(cell.value as Date)).toLocaleDateString()
            case ValueType.String:
                return (cell.value as string)
            case ValueType.Hyperlink:
                return cell?.hyperlink ?? "LINK"
            case ValueType.RichText:
                return CellFormatter.handleRichText(cell.value)
            case ValueType.Formula:
                return (cell?.value as CellFormulaValue).result?.toString() ?? ''
            case ValueType.Null:
                return ''
            case ValueType.Merge:
                return CellFormatter.getCellText({ ...cell, type: cell.effectiveType, value: cell.value })
            default:
                return "Unknown Value"
        }
    }

    private static handleRichText(value: CellValue) {
        if (CellFormatter.isRichText(value)) {
            return value.richText.map(richText => richText.text).join('\n')
        } else {
            return 'ERROR'
        }
    }

    private static isRichText(value: CellValue): value is CellRichTextValue {
        return !!(typeof value === 'object' && value && 'richText' in value)
    }
}