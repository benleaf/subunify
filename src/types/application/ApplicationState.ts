import { TableResult } from "../server/TableResult";
import { LoadDataRequests } from "./ApplicationEvents";
import { DashboardScreens } from "./DashboardScreens";
import { ServerTable } from "./ServerTable";

export type ApplicationState = {
    loadingData?: LoadDataRequests['data'],
    organisationId?: string,
    userId?: string,
    tables?: TableResult[],
    selectedTable?: ServerTable,
    selectedScreen?: DashboardScreens,
}