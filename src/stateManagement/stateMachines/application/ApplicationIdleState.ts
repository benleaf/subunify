import { BaseState } from "../BaseState";
import { TableState } from "../dashboard/TableState";
import { ViewerState } from "../excelImporter/ViewerState";
import { ApplicationEvents } from "./types/ApplicationEvents";

export class ApplicationIdleState extends BaseState {
    public handleAction(event: ApplicationEvents): BaseState {
        switch (event.action) {
            case "startExcelImporter":
                return new ViewerState({
                    machine: 'excelImporter',
                    cursor: undefined,
                    scroll: { x: 1, y: 1 },
                    mousePosition: { x: 1, y: 1 },
                    tables: [],
                    worksheetId: 0,
                    flowState: 'editing'
                })
            case "startDashboard":
                return new TableState({
                    machine: 'dashboard',
                })
            default:
                return new ApplicationIdleState({
                    ...this.data,
                    ...this.handleUniversalActions(event)
                })
        }
    }
}