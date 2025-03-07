import { BaseState } from "../BaseState";
import { ApplicationEvents } from "../application/types/ApplicationEvents";
import { ApplicationStateData } from "../application/types/ApplicationStateData";

type SheetData = Extract<ApplicationStateData, { machine: 'excelImporter' }>

export abstract class SheetState extends BaseState {
    constructor(public data: SheetData) {
        super(data)
    }
    public abstract handleAction(event: ApplicationEvents): BaseState
}