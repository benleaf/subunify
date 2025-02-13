import { Coordinate } from "@/types/Coordinate";
import { SheetEvents } from "@/types/SheetEvents";
import { SheetState } from "./SheetState";

export abstract class ScrollableSheetState extends SheetState {
    protected handleScrollEvent(event: SheetEvents) {
        if (event.action !== "mouseNearEdge") return this.data

        const defaultAcceleration = 0.02
        const delta = this.data.scrollAcceleration ?? defaultAcceleration
        if (event.data === "RemoveAcceleration") return {
            ...this.data,
            scrollAcceleration: defaultAcceleration
        }

        const dirMap: { [x: string]: Coordinate } = {
            't': { x: this.data.scroll.x, y: Math.max(1, this.data.scroll.y - delta) },
            'r': { x: this.data.scroll.x + delta, y: this.data.scroll.y },
            'b': { x: this.data.scroll.x, y: this.data.scroll.y + delta },
            'l': { x: Math.max(1, this.data.scroll.x - delta), y: this.data.scroll.y },
        }
        return {
            ...this.data,
            scroll: dirMap[event.data],
            scrollAcceleration: delta + 0.1
        }
    }
}