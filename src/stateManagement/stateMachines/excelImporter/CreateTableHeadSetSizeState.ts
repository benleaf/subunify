import { SheetState } from "./SheetState";
import { SheetEvents } from "@/stateManagement/stateMachines/excelImporter/types/SheetEvents";
import { ViewerState } from "./ViewerState";
import { BoundingBox } from "../../../helpers/BoundingBox";
import { ScrollableSheetState } from "./ScrollableSheetState";

export class CreateTableHeadSetSizeState extends ScrollableSheetState {
    public handleAction(event: SheetEvents): SheetState {
        switch (event.action) {
            case "mouseMoved":
                return new CreateTableHeadSetSizeState({
                    ...this.data,
                    tables: this.getTablesForResize()
                })
            case "mouseDown":
                return new ViewerState({
                    ...this.data,
                    cursor: undefined
                })
            case "finishEditing":
                return new ViewerState({
                    ...this.data,
                    cursor: undefined
                })
            case "touchStop":
                return new ViewerState({
                    ...this.data,
                    cursor: undefined
                })
            case "cellSelected":
                return new CreateTableHeadSetSizeState({
                    ...this.data,
                    selectedCell: event.data,
                    tables: this.getTablesForResize()
                })
            case "scroll":
                return new CreateTableHeadSetSizeState({
                    ...this.data,
                    scroll: {
                        x: Math.max(1, this.data.scroll.x + event.data.x),
                        y: Math.max(1, this.data.scroll.y + event.data.y)
                    }
                })
            case "mouseNearEdge":
                return new CreateTableHeadSetSizeState(this.handleScrollEvent(event))
            default:
                return this
        }
    }

    private getTablesForResize() {
        const newTables = [...this.data.tables]
        const dimensions = {
            x: Math.abs(this.data.selectedCell!.x - this.data.resizeAncorPossition!.x),
            y: Math.abs(this.data.selectedCell!.y - this.data.resizeAncorPossition!.y)
        }

        const axisAlignedPosition = dimensions.x > dimensions.y ?
            { x: this.data.selectedCell!.x, y: this.data.resizeAncorPossition!.y } :
            { x: this.data.resizeAncorPossition!.x, y: this.data.selectedCell!.y }

        newTables[this.data.selectedTableIndex!].head = BoundingBox.getResizedBoxViaAnchor(
            axisAlignedPosition,
            this.data.resizeAncorPossition!
        )
        return newTables
    }
}