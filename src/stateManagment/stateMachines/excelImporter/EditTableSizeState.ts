import { SheetState } from "./SheetState";
import { SheetEvents } from "@/stateManagment/stateMachines/excelImporter/types/SheetEvents";
import { ViewerState } from "./ViewerState";
import { ScrollableSheetState } from "./ScrollableSheetState";
import { BoundingBox } from "@/helpers/BoundingBox";

export class EditTableSizeState extends ScrollableSheetState {
    public handleAction(event: SheetEvents): SheetState {
        switch (event.action) {
            case "mouseUp":
                return new ViewerState({ ...this.data })
            case "cellSelected":
                if (this.data.selectedTableIndex === undefined) return this
                const newTables = [...this.data.tables]
                const { corner, tableElement } = this.data.selectedTableCorner!

                newTables[this.data.selectedTableIndex][tableElement] = BoundingBox.moveEdge(
                    newTables[this.data.selectedTableIndex][tableElement]!,
                    corner,
                    event.data
                )

                return new EditTableSizeState({
                    ...this.data,
                    selectedCell: event.data,
                    resizeAncorPossition: newTables[this.data.selectedTableIndex].body?.box.tl,
                    tables: newTables
                })
            case "scroll":
                return new EditTableSizeState({
                    ...this.data,
                    scroll: {
                        x: Math.max(1, this.data.scroll.x + event.data.x),
                        y: Math.max(1, this.data.scroll.y + event.data.y)
                    }
                })
            case "mouseNearEdge":
                return new EditTableSizeState(this.handleScrollEvent(event))
            default:
                return this
        }
    }
}