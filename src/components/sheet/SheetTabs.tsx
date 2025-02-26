import { Box, Tabs, Tab, Stack, Button } from "@mui/material";
import { Worksheet } from "exceljs"
import { createContext, Dispatch, useReducer } from "react";
import Sheet from "./Sheet";
import { reducer } from "../../stateManagment/reducers/SheetStateMachineReducer";
import { ViewerState } from "../../stateManagment/stateMachine/ViewerState";
import { SheetEvents } from "@/types/spreadsheet/SheetEvents";
import TableControlWidgets from "../tableEditor/TableControlWidgets";
import TableEditor from "../tableEditor/TableEditor";
import GlassCard from "../glassmorphism/GlassCard";
import FloatingGlassCircle from "../glassmorphism/FloatingGlassCircle";

type Props = {
    worksheets?: Worksheet[]
}

export const StateMachineDispatch = createContext<{
    dispatch: Dispatch<SheetEvents>,
    state: ViewerState
} | undefined>(undefined);

const SheetTabs = ({ worksheets }: Props) => {
    const [state, dispatch] = useReducer(reducer, new ViewerState({
        scroll: { x: 1, y: 1 },
        mousePossition: { x: 1, y: 1 },
        tables: [],
        worksheetId: 0
    }));

    return <StateMachineDispatch.Provider value={{ dispatch, state }}>
        <Box sx={{ width: '100%' }}>
            <Stack direction="row">
                <div style={{ flex: 1, height: '80vh' }}>
                    <GlassCard marginSize="small" paddingSize="small">
                        <Tabs
                            value={state.data.worksheetId}
                            onChange={(_: React.SyntheticEvent, newValue: number) => dispatch({ action: "setWorksheet", data: newValue })}
                        >
                            {worksheets?.map((sheet, key) => <Tab key={key} label={sheet.name} />)}
                        </Tabs>
                    </GlassCard>
                    <GlassCard grow marginSize="small" paddingSize="small">
                        {state.data.tables &&
                            <Sheet
                                worksheet={worksheets && worksheets[state.data.worksheetId]}
                                worksheetId={state.data.worksheetId}
                                selectedTableIndex={state.data.selectedTableIndex}
                                sheetTables={state.data.tables}
                                possition={{ x: state.data.scroll.x ?? 1, y: state?.data.scroll.y ?? 1 }}
                            />
                        }
                    </GlassCard>
                </div>
                <div style={{ flex: 1 }}>
                    {worksheets && (
                        state.data.selectedTableIndex !== undefined ?
                            <TableEditor
                                table={state.data.tables[state.data.selectedTableIndex]}
                                worksheets={worksheets}
                                tableIndex={state.data.selectedTableIndex}
                            /> :
                            <TableControlWidgets tables={state.data.tables} worksheets={worksheets} />
                    )}
                </div>
            </Stack>
        </Box>
    </StateMachineDispatch.Provider>
}

export default SheetTabs
