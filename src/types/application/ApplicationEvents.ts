import { ApiEventRequestData } from "./ApiEventRequestData";
import { DashboardScreens } from "./DashboardScreens";
import { RequestableResources } from "./RequestableResources";


type LoadAction = {
    [K in keyof RequestableResources]: { action: K, data: RequestableResources[K]['result'] }
}[keyof RequestableResources]

export type ApplicationEvents =
    { action: "setSelectedScreen", data: DashboardScreens } |
    { action: "loadData", data: ApiEventRequestData<keyof RequestableResources> } |
    LoadAction