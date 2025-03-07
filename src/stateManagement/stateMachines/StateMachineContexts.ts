import { Dispatch } from "react";
import { ApplicationIdleState } from "./application/ApplicationIdleState";
import { ApplicationEvents } from "./application/types/ApplicationEvents";
import { DashboardEvents } from "./dashboard/types/DashboardEvents";
import { TableState } from "./dashboard/TableState";
import { SheetEvents } from "./excelImporter/types/SheetEvents";
import { ViewerState } from "./excelImporter/ViewerState";

export type StateMachineContexts = {
    application: { dispatch: Dispatch<ApplicationEvents>, state: ApplicationIdleState },
    dashboard: { dispatch: Dispatch<DashboardEvents>, state: TableState },
    sheet: { dispatch: Dispatch<SheetEvents>, state: ViewerState },
}