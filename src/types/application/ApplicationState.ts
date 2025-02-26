import { TableResult } from "../server/TableResult";
import { DashboardScreens } from "./DashboardScreens";
import { Dto } from "./Dto";
import { RequestableResources } from "./RequestableResources";
import { Table } from "./Table";

export type ApplicationState = {
    loadingData?: { resource: keyof RequestableResources, method: TODO, dto?: Dto },
    organisationId?: string,
    userId?: string,
    tables?: TableResult[],
    selectedTable?: Table,
    selectedScreen?: DashboardScreens,
}