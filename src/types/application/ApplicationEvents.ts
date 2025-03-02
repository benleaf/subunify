import { DashboardScreens } from "./DashboardScreens";
import { RequestableResources } from "./RequestableResources";
import { ServerRow } from "./ServerRow";

type LoadAction = {
    [K in keyof RequestableResources]: { action: K, data: RequestableResources[K]['result'] }
}[keyof RequestableResources]

export type LoadDataRequests = {
    [K in keyof RequestableResources]: { action: "loadData", data: { request: K, resources?: RequestableResources[K] } }
}[keyof RequestableResources]

export type ApplicationEvents =
    { action: "setSelectedTableRows", data: ServerRow[] } |
    { action: "setSelectedScreen", data: DashboardScreens } |
    LoadDataRequests |
    LoadAction