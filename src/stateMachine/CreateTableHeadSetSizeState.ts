import { SheetState } from "./SheetState";
import { SheetEvents } from "@/types/SheetEvents";
import { ViewerState } from "./ViewerState";
import { BoundingBox } from "../helpers/BoundingBox";
import { ScrollableSheetState } from "./ScrollableSheetState";

export class CreateTableHeadSetSizeState extends ScrollableSheetState {
    public handleAction(event: SheetEvents): SheetState {
        switch (event.action) {
            case "mouseMoved":
                const newTables = [...this.data.tables]
                newTables[this.data.selectedTableIndex!].head = BoundingBox.getResizedBoxViaAnchor(this.data.selectedCell!, this.data.resizeAncorPossition!)
                return new CreateTableHeadSetSizeState({
                    ...this.data,
                    tables: newTables
                })
            case "mouseDown":
                return new ViewerState({ ...this.data })
            case "cellSelected":
                return new CreateTableHeadSetSizeState({
                    ...this.data,
                    selectedCell: event.data
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
}