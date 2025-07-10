import { AuthAction } from "@/types/actions/AuthAction"
import { UpdateProperties } from "./UpdateProperties"
import { DashboardProperties } from "./DashboardProperties"
import { AlertColor } from "@mui/material"

export type ActionInput = {
    authAction: AuthAction,
    updateProperties: UpdateProperties
    properties: Partial<DashboardProperties>
    setAlert: (message: string, colour?: AlertColor) => void
}