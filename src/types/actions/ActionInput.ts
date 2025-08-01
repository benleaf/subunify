import { AuthAction } from "@/types/actions/AuthAction"
import { UpdateProperties } from "./UpdateProperties"
import { DashboardProperties } from "./DashboardProperties"
import { AlertColor } from "@mui/material"
import { ProjectResult } from "../server/ProjectResult"

export type ActionInput = {
    downloadAction: (endpoint: string, bytes: number) => Promise<void>,
    authAction: AuthAction,
    updateProperties: UpdateProperties
    properties: Partial<DashboardProperties>
    setAlert: (message: string, colour?: AlertColor) => void
    setLoading: (isLoading: boolean) => void
    loadProject: (projectId?: string) => Promise<ProjectResult | undefined>
}