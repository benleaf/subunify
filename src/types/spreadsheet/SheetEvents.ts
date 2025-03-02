import { Coordinate } from "./Coordinate";
import { Direction } from "./Direction";
import { FlowStates } from "./FlowStates";
import { TableCorner } from "./TableCorner";

export type SheetEvents =
    { action: "goToCell", data: Partial<Coordinate> } |
    { action: "cellSelected", data: Coordinate } |
    { action: "setScroll", data: Coordinate } |
    { action: "scroll", data: Coordinate } |
    { action: "mouseUp" } |
    { action: "mouseMoved", data: Coordinate } |
    { action: "mouseDown", data: Coordinate } |
    { action: "createTable" } |
    { action: "setFlowState", data: FlowStates } |
    { action: "finishEditing" } |
    { action: "editTable", data: number } |
    { action: "loading", data: boolean } |
    { action: "addTableColumnNames", data: number } |
    { action: "addTableData", data: number } |
    { action: "setWorksheet", data: number } |
    { action: "renameTable", data: string } |
    { action: "renameColumn", data: { value: string, columnId: number } } |
    { action: "dragSelectedTableCorner", data: TableCorner } |
    { action: "mouseNearEdge", data: Direction | 'RemoveAcceleration' }