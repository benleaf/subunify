import { Coordinate } from "@/types/spreadsheet/Coordinate";
import { Direction } from "@/types/spreadsheet/Direction";
import { FlowStates } from "@/types/spreadsheet/FlowStates";
import { TableCorner } from "@/types/spreadsheet/TableCorner";
import { ApplicationEvents } from "../../application/types/ApplicationEvents";
import { Worksheet } from "exceljs";

export type SheetEvents = SheetExclusiveEvents | ApplicationEvents

type SheetExclusiveEvents =
    { action: "goToCell", data: Partial<Coordinate> } |
    { action: "cellSelected", data: Coordinate } |
    { action: "touchStart", data: Coordinate } |
    { action: "touchStop" } |
    { action: "touchMove", data: Coordinate } |
    { action: "setWorksheets", data: Worksheet[] } |
    { action: "setScroll", data: Coordinate } |
    { action: "scroll", data: Coordinate } |
    { action: "mouseUp" } |
    { action: "mouseMoved", data: Coordinate } |
    { action: "mouseDown", data: Coordinate } |
    { action: "createTable" } |
    { action: "setFlowState", data: FlowStates } |
    { action: "finishEditing" } |
    { action: "editTable", data: number } |
    { action: "deleteTable", data: number } |
    { action: "addTableColumnNames", data: number } |
    { action: "addTableData", data: number } |
    { action: "touchScreenOnly", data: boolean } |
    { action: "setWorksheet", data: number } |
    { action: "renameTable", data: string } |
    { action: "renameColumn", data: { value: string, columnId: number } } |
    { action: "dragSelectedTableCorner", data: TableCorner } |
    { action: "mouseNearEdge", data: Direction | 'RemoveAcceleration' }