import { SheetState } from "./SheetState";
import { SheetEvents } from "@/stateManagment/stateMachines/excelImporter/types/SheetEvents";
import { CreateTableHeadSetSizeState } from "./CreateTableHeadSetSizeState";

export class CreateTableHeadState extends SheetState {
    public handleAction(event: SheetEvents): SheetState {
        switch (event.action) {
            case "mouseDown":
                if (this.data.selectedCell === undefined) return this
                return new CreateTableHeadSetSizeState({
                    ...this.data,
                    resizeAncorPossition: this.data.selectedCell,
                })
            case "cellSelected":
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
}