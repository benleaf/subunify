import { TableResult } from "../server/TableResult"
import { GetTableBodyDto } from "./GetTableBodyDto"
import { ServerTable } from "./ServerTable"

export type RequestableResources = {
    tableGetAll: {
        result?: TableResult[]
    },
    tableGetBodyById: {
        params: GetTableBodyDto,
        result?: ServerTable,
    }
}