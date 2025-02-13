import { BoundingBox } from "../helpers/BoundingBox";
import { CreateTableDataState } from "./CreateTableDataState";
import { SheetState } from "./SheetState";
import { SheetEvents } from "@/types/SheetEvents";

export class CreateTableAnchorDataState extends SheetState {
    public handleAction(event: SheetEvents): SheetState {
        switch (event.action) {
            case "mouseDown":
                return new CreateTableDataState({
                    ...this.data,
                })
            case "cellSelected":
                if (this.data.selectedTableIndex === undefined) return this
                const newTables = [...this.data.tables]

                newTables[this.data.selectedTableIndex].body = BoundingBox.getOriantationAlignedOffset(
                    newTables[this.data.selectedTableIndex].head!,
                    event.data
                )

                return new CreateTableAnchorDataState({
                    ...this.data,
                    selectedCell: event.data,
                    resizeAncorPossition: newTables[this.data.selectedTableIndex].body?.box.tl,
                    tables: newTables
                })
            case "scroll":
                return new CreateTableAnchorDataState({
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