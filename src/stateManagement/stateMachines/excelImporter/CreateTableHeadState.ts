import { SheetState } from "./SheetState";
import { SheetEvents } from "@/stateManagement/stateMachines/excelImporter/types/SheetEvents";
import { CreateTableHeadSetSizeState } from "./CreateTableHeadSetSizeState";
import { BoundingBox } from "@/helpers/BoundingBox";
import { Position } from "@mui/x-charts/ChartsLegend/legend.types";
import { ViewerState } from "./ViewerState";

export class CreateTableHeadState extends SheetState {
    public handleAction(event: SheetEvents): SheetState {
        switch (event.action) {
            case "mouseDown":
                if (this.data.selectedCell === undefined) return this
                return new CreateTableHeadSetSizeState({
                    ...this.data,
                    tables: this.createNewTables(this.data.selectedCell),
                    resizeAncorPossition: this.data.selectedCell,
                })
            case "finishEditing":
                return new ViewerState({
                    ...this.data,
                    cursor: undefined
                })
            case "cellSelected":
                if (this.data.touchScreenOnly) {
                    return new CreateTableHeadSetSizeState({
                        ...this.data,
                        tables: this.createNewTables(event.data),
                    })
                }
                return new CreateTableHeadState({
                    ...this.data,
                    selectedCell: event.data
                })
            case "scroll":
                return new CreateTableHeadState({
                    ...this.data,
                    scroll: {
                        x: Math.max(1, this.data.scroll.x + event.data.x),
                        y: Math.max(1, this.data.scroll.y + event.data.y)
                    }
                })
            default:
                return this
        }
    }

    private createNewTables(position: Position) {
        const newTables = [...this.data.tables]
        newTables[this.data.selectedTableIndex!].head = BoundingBox.getResizedBoxViaAnchor(position, position)
        return newTables
    }
}