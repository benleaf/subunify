import { AuthAction } from "@/types/actions/AuthAction"
import { UpdateProperties } from "./UpdateProperties"
import { DashboardProperties } from "./DashboardProperties"

export type ActionInput = {
    authAction: AuthAction,
    updateProperties: UpdateProperties
    properties: Partial<DashboardProperties>
}