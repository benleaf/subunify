import { BaseState } from "../BaseState";
import { TableState } from "../dashboard/TableState";
import { ViewerState } from "../excelImporter/ViewerState";
import { ApplicationEvents } from "./types/ApplicationEvents";

export class ApplicationIdelState extends BaseState {
    public handleAction(event: ApplicationEvents): BaseState {
        switch (event.action) {
            case "startExcelImporter":
                return new ViewerState({
                    machine: 'excelImporter',
                    scroll: { x: 1, y: 1 },
                    mousePossition: { x: 1, y: 1 },
                    tables: [],
                    worksheetId: 0,
                    flowState: 'editing'
                })
            case "startDashboard":
                return new TableState({
                    machine: 'dashboard',
                })
            default:
                return new ApplicationIdelState({
                    ...this.data,
                    ...this.handleUniversalActions(event)
                })
        }
    }
}