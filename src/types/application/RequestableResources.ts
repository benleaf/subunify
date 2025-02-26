import { TableResult } from "../server/TableResult"
import { GetTableBodyDto } from "./GetTableBodyDto"
import { Table } from "./Table"

export type RequestableResources = {
    'table': { result?: TableResult[] },
    'table/body': { result?: Table, dto: GetTableBodyDto }
}