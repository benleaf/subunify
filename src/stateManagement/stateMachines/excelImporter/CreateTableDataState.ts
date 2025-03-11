import { BoundingBox } from "../../../helpers/BoundingBox";
import { SheetState } from "./SheetState";
import { SheetEvents } from "@/stateManagement/stateMachines/excelImporter/types/SheetEvents";
import { ViewerState } from "./ViewerState";
import { ScrollableSheetState } from "./ScrollableSheetState";

export class CreateTableDataState extends ScrollableSheetState {
    public handleAction(event: SheetEvents): SheetState {
        switch (event.action) {
            case "mouseDown":
                return new ViewerState({
                    ...this.data,
                    cursor: undefined,
                    resizeAncorPossition: undefined
                })
            case "finishEditing":
                return new ViewerState({
                    ...this.data,
                    cursor: undefined
                })
            case "cellSelected":
                if (this.data.selectedTableIndex === undefined) return this
                const newTables = [...this.data.tables]
                const orientationOfHead = BoundingBox.getOrientation(newTables[this.data.selectedTableIndex].head!)
                const directionOfResize = BoundingBox.swapOrientation(orientationOfHead)

                newTables[this.data.selectedTableIndex].body = BoundingBox.getResizedBoxViaAnchorAndAxis(
                    event.data,
                    this.data.resizeAncorPossition!,
                    newTables[this.data.selectedTableIndex].body!,
                    directionOfResize
                )

                return new CreateTableDataState({
                    ...this.data,
                    selectedCell: event.data,
                    tables: newTables
                })
            case "scroll":
                return new CreateTableDataState({
                    ...this.data,
                    scroll: {
                        x: Math.max(1, this.data.scroll.x + event.data.x),
                        y: Math.max(1, this.data.scroll.y + event.data.y)
                    }
                })
            case "mouseNearEdge":
                return new CreateTableDataState(this.handleScrollEvent(event))
            default:
                return this
        }
    }
}