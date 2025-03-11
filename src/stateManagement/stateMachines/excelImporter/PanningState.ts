import { Coordinate } from "@/types/spreadsheet/Coordinate";
import { SheetState } from "./SheetState";
import { ViewerState } from "./ViewerState";
import { SheetEvents } from "@/stateManagement/stateMachines/excelImporter/types/SheetEvents";

export class PanningState extends SheetState {
    public handleAction(event: SheetEvents): SheetState {
        switch (event.action) {
            case "mouseMoved":
                return this.pan(event.data)
            case "touchMove":
                return this.pan(event.data)
            case "mouseUp":
                return new ViewerState(this.data)
            case "touchStop":
                return new ViewerState(this.data)
            default:
                return this
        }
    }

    private pan = (position: Coordinate) => {
        return new PanningState({
            ...this.data,
            scroll: {
                x: Math.max(1, this.data.scroll.x + -(position.x - this.data.mousePosition.x) / 50),
                y: Math.max(1, this.data.scroll.y + -(position.y - this.data.mousePosition.y) / 20)
            },
            mousePosition: { x: position.x, y: position.y }
        })
    }
}