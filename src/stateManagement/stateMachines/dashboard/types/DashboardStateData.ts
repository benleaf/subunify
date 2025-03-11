import { TableResult } from "../../../../types/server/TableResult";
import { DashboardScreens } from "../../../../types/application/DashboardScreens";
import { ServerTable } from "../../../../types/application/ServerTable";

export type DashboardStateData = {
    organisationId?: string,
    userId?: string,
    tables?: TableResult[],
    selectedTable?: ServerTable,
    selectedScreen?: DashboardScreens,
}