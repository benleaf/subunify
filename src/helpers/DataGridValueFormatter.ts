import { DisplayableTableColumn } from "@/types/application/DisplayableTableColumn";
import { GridColDef } from "@mui/x-data-grid-pro";

export class DataGridValueFormatter {
    public static format(columns: DisplayableTableColumn[]): GridColDef[] {
        return columns.map(column => DataGridValueFormatter.formatColumn(column) as GridColDef)
    }

    private static formatColumn(column: DisplayableTableColumn) {
        switch (column.type) {
            case 'date':
                return {
                    ...column,
                    valueFormatter: (dateString: string | undefined) =>
                        dateString && (new Date(dateString)).toLocaleString()
                }
            default:
                return column
        }
    }
} 