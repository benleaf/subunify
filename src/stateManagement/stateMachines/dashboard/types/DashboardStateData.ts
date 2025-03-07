import { TableResult } from "../../../../types/server/TableResult";
import { LoadDataRequests } from "./DashboardEvents";
import { DashboardScreens } from "../../../../types/application/DashboardScreens";
import { ServerTable } from "../../../../types/application/ServerTable";

export type DashboardStateData = {
    loadingData?: LoadDataRequests['data'],
    organisationId?: string,
    userId?: string,
    tables?: TableResult[],
    selectedTable?: ServerTable,
    selectedScreen?: DashboardScreens,
}