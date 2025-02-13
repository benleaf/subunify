import { Cell, CellFormulaValue, ValueType } from "exceljs";

export class CellFormatter {
    public static getHeaderCellText(cell: Cell) {
        return cell.type === ValueType.String ? cell.value : 'ERROR'
    }

    public static getCellText(cell: Cell) {
        switch (cell.type) {
            case ValueType.Boolean:
                return !!cell.value ? "true" : "false"
            case ValueType.Number:
                return (cell.value as number).toFixed(1)
            case ValueType.Date:
                return (new Date(cell.value as Date)).toLocaleDateString()
            case ValueType.String:
                return (cell.value as string)
            case ValueType.RichText:
                if (typeof cell.value === 'object' && cell.value && 'richText' in cell.value) {
                    return cell?.value?.richText.map(richText => richText.text).join('')
                } else {
                    return 'test'
                }
            case ValueType.Formula:
                return (cell?.value as CellFormulaValue).formula
            default:
                return (cell?.value ? JSON.stringify(cell?.value) : "")
        }
    }
}