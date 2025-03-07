import { AlertColor } from "@mui/material"
import { DashboardStateData } from "../../dashboard/types/DashboardStateData"
import { SheetStateData } from "../../excelImporter/types/SheetStateData"

export type ApplicationStateData = StateMachines & UniversalState

export type UniversalState = {
    loading?: boolean,
    popup?: { colour: AlertColor, message: string },
}

type StateMachines =
    { machine: 'idle' } |
    { machine: 'excelImporter' } & SheetStateData |
    ({ machine: 'dashboard' } & DashboardStateData)