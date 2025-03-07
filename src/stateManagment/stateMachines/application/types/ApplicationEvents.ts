import { AlertColor } from "@mui/material";

export type ApplicationEvents =
    { action: "startExcelImporter" } |
    { action: "startDashboard" } |
    { action: "popup", data?: { colour: AlertColor, message: string } } |
    { action: "loading", data: boolean }