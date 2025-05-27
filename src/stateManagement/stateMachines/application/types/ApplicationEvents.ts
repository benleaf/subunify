import { AlertColor } from "@mui/material";

export type ApplicationEvents =
    { action: "popup", data?: { colour: AlertColor, message: string } } |
    { action: "loading", data: boolean }