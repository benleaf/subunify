import { Dispatch } from "react";
import { TableState } from "./dashboard/TableState";
import { DashboardEvents } from "./dashboard/types/DashboardEvents";
import { StateMachineContext } from "./StateMachineContext";
import { StateMachineContexts } from "./StateMachineContexts";

export const isDashboard = (context: StateMachineContext): context is { dispatch: Dispatch<DashboardEvents>, state: TableState } => {
    return context?.state.data.machine == 'dashboard'
}

export const isIdle = (context: StateMachineContext): context is StateMachineContexts['application'] => {
    return context?.state.data.machine == 'idle'
}

export const isExcelImporter = (context: StateMachineContext): context is StateMachineContexts['sheet'] => {
    return context?.state.data.machine == 'excelImporter'
}