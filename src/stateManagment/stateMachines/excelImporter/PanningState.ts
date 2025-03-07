import { SheetState } from "./SheetState";
import { ViewerState } from "./ViewerState";
import { SheetEvents } from "@/stateManagment/stateMachines/excelImporter/types/SheetEvents";

export class PanningState extends SheetState {
    public handleAction(event: SheetEvents): SheetState {
        switch (event.action) {
            case "mouseMoved":
                return new PanningState({
                    ...this.data,
                    scroll: {
                        x: Math.max(1, this.data.scroll.x + -(event.data.x - this.data.mousePossition.x) / 50),
                        y: Math.max(1, this.data.scroll.y + -(event.data.y - this.data.mousePossition.y) / 20)
                    },
                    mousePossition: { x: event.data.x, y: event.data.y }
                })

            case "mouseUp":
                return new ViewerState(this.data)
            default:
                return this
        }
    }
}