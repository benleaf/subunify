import { DashboardScreens } from "@/types/application/DashboardScreens"
import { RequestableResources } from "@/types/application/RequestableResources"
import { ServerRow } from "@/types/application/ServerRow"
import { ApplicationEvents } from "../../application/types/ApplicationEvents"

export type DashboardEvents = DashboardExclusiveEvents | ApplicationEvents

type LoadAction = {
    [K in keyof RequestableResources]: { action: K, data: RequestableResources[K]['result'] }
}[keyof RequestableResources]

type DashboardExclusiveEvents =
    { action: "setSelectedTableRows", data: ServerRow[] } |
    { action: "setSelectedScreen", data: DashboardScreens } |
    LoadAction