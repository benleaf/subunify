import { SheetEvents } from "@/types/SheetEvents";
import { SheetStateData } from "@/types/SheetStateData";

export abstract class SheetState {
    constructor(public data: SheetStateData) { }
    public abstract handleAction(event: SheetEvents): SheetState
}