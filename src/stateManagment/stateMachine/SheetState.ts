import { SheetEvents } from "@/types/spreadsheet/SheetEvents";
import { SheetStateData } from "@/types/spreadsheet/SheetStateData";

export abstract class SheetState {
    constructor(public data: SheetStateData) { }
    public abstract handleAction(event: SheetEvents): SheetState
}