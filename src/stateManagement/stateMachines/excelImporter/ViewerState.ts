import { PanningState } from "./PanningState";
import { CreateTableHeadState } from "./CreateTableHeadState";
import { CreateTableAnchorDataState } from "./CreateTableAnchorDataState";
import { EditTableSizeState } from "./EditTableSizeState";
import { BaseState } from "../BaseState";
import { SheetState } from "./SheetState";
import { SheetEvents } from "./types/SheetEvents";
import { ApplicationEvents } from "../application/types/ApplicationEvents";

export class ViewerState extends SheetState {
    public handleAction(event: SheetEvents): BaseState {
        switch (event.action) {
            case "setWorksheets":
                return new ViewerState({
                    ...this.data,
                    worksheets: event.data
                })
            case "goToCell":
                return new ViewerState({
                    ...this.data,
                    scroll: { ...this.data.scroll, ...event.data }
                })
            case "mouseDown":
                return new PanningState({
                    ...this.data,
                    mousePossition: { x: event.data.x, y: event.data.y }
                })
            case "setFlowState":
                return new ViewerState({
                    ...this.data,
                    flowState: event.data
                })
            case "mouseMoved":
                return new ViewerState({
                    ...this.data,
                    mousePossition: { x: event.data.x, y: event.data.y }
                })
            case "setScroll":
                return new ViewerState({
                    ...this.data,
                    scroll: { x: event.data.x, y: event.data.y }
                })
            case "scroll":
                return new ViewerState({
                    ...this.data,
                    scroll: {
                        x: Math.max(1, this.data.scroll.x + event.data.x),
                        y: Math.max(1, this.data.scroll.y + event.data.y)
                    }
                })
            case "createTable":
                return new ViewerState({
                    ...this.data,
                    tables: [...this.data.tables, {
                        parentWorksheetId: this.data.worksheetId,
                        name: `New Table ${this.data.tables.length + 1}`
                    }],
                })
            case "finishEditing":
                return new ViewerState({
                    ...this.data,
                    selectedTableIndex: undefined
                })
            case "editTable":
                return new ViewerState({
                    ...this.data,
                    scroll: this.data.tables[event.data].head?.box.tl ?? this.data.scroll,
                    worksheetId: this.data.tables[event.data].parentWorksheetId,
                    selectedTableIndex: event.data
                })
            case "cellSelected":
                return new ViewerState({
                    ...this.data,
                    selectedCell: event.data
                })
            case "addTableColumnNames":
                return new CreateTableHeadState({
                    ...this.data,
                    selectedTableIndex: event.data
                })
            case "dragSelectedTableCorner":
                return new EditTableSizeState({
                    ...this.data,
                    selectedTableCorner: event.data
                })
            case "addTableData":
                return new CreateTableAnchorDataState({
                    ...this.data,
                    resizeAncorPossition: undefined,
                    selectedTableIndex: event.data
                })
            case "setWorksheet":
                return new ViewerState({
                    ...this.data,
                    worksheetId: event.data
                })
            case "renameTable":
                const newTables = [...this.data.tables]
                newTables[this.data.selectedTableIndex!].name = event.data

                return new ViewerState({
                    ...this.data,
                    tables: this.data.tables
                })
            case "loading":
                return new ViewerState({
                    ...this.data,
                    loading: event.data
                })
            case "renameColumn":
                const tablesClone = [...this.data.tables]
                const columnOverides = tablesClone[this.data.selectedTableIndex!].columnOverrides
                tablesClone[this.data.selectedTableIndex!].columnOverrides = {
                    ...columnOverides,
                    [event.data.columnId]: event.data.value
                }

                return new ViewerState({
                    ...this.data,
                    tables: this.data.tables
                })
            default:
                return new ViewerState({
                    ...this.data,
                    ...this.handleUniversalActions(event as ApplicationEvents)
                })
        }
    }
}