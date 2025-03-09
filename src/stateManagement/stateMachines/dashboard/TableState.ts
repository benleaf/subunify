import { BaseState } from "../BaseState";
import { ViewerState } from "../excelImporter/ViewerState";
import { DashboardState } from "./DashboardState";
import { DashboardEvents } from "./types/DashboardEvents";

export class TableState extends DashboardState {
    public handleAction(event: DashboardEvents): BaseState {
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
            case 'loadData':
                return new TableState({
                    ...this.data,
                    loadingData: event.data
                })
            case 'tableGetAll':
                return new TableState({
                    ...this.data,
                    tables: event.data
                })
            case 'tableGetBodyById':
                return new TableState({
                    ...this.data,
                    selectedTable: event.data ? { ...event.data } : undefined
                })
            case 'setSelectedScreen':
                return new TableState({
                    ...this.data,
                    selectedScreen: event.data
                })
            case 'setSelectedTableRows':
                return new TableState({
                    ...this.data,
                    selectedTable: this.data.selectedTable ? { ...this.data.selectedTable, rows: event.data } : undefined
                })
            default:
                return new TableState({
                    ...this.data,
                    ...this.handleUniversalActions(event)
                })
        }
    }
}