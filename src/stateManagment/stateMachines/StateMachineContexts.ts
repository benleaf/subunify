import { Dispatch } from "react";
import { ApplicationIdelState } from "./application/ApplicationIdleState";
import { ApplicationEvents } from "./application/types/ApplicationEvents";
import { DashboardEvents } from "./dashboard/types/DashboardEvents";
import { TableState } from "./dashboard/TableState";
import { SheetEvents } from "./excelImporter/types/SheetEvents";
import { ViewerState } from "./excelImporter/ViewerState";

export type StateMachineContexts = {
    application: { dispatch: Dispatch<ApplicationEvents>, state: ApplicationIdelState },
    dashboard: { dispatch: Dispatch<DashboardEvents>, state: TableState },
    sheet: { dispatch: Dispatch<SheetEvents>, state: ViewerState },
}