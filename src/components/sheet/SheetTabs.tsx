import { Box, Tabs, Tab, Backdrop, CircularProgress } from "@mui/material";
import { Worksheet } from "exceljs"
import { createContext, Dispatch, useReducer } from "react";
import Sheet from "./Sheet";
import { reducer } from "../../stateManagment/reducers/SheetStateMachineReducer";
import { ViewerState } from "../../stateManagment/stateMachine/ViewerState";
import { SheetEvents } from "@/types/spreadsheet/SheetEvents";
import TableControlWidgets from "../tableEditor/TableControlWidgets";
import TableEditor from "../tableEditor/TableEditor";
import GlassCard from "../glassmorphism/GlassCard";
import DynamicStack from "../glassmorphism/DynamicStack";
import DynamicDrawer from "../glassmorphism/DynamicDrawer";

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
        worksheetId: 0,
        flowState: 'editing'
    }));

    return <StateMachineDispatch.Provider value={{ dispatch, state }}>
        <Box sx={{ width: '100%' }}>
            <DynamicStack>
                <div style={{ height: '80vh', flex: 1 }}>
                    <GlassCard marginSize="small" paddingSize="small">
                        <Tabs
                            value={state.data.worksheetId}
                            onChange={(_: React.SyntheticEvent, newValue: number) => dispatch({ action: "setWorksheet", data: newValue })}
                        >
                            {worksheets?.map((sheet, key) => <Tab key={key} label={sheet.name} />)}
                        </Tabs>
                    </GlassCard>
                    <GlassCard height='80vh' marginSize="small" paddingSize="small">
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
                    <DynamicDrawer drawLabel="Table Editor">
                        {worksheets && (
                            state.data.selectedTableIndex !== undefined ?
                                <TableEditor
                                    table={state.data.tables[state.data.selectedTableIndex]}
                                    worksheets={worksheets}
                                    tableIndex={state.data.selectedTableIndex}
                                /> :
                                <TableControlWidgets tables={state.data.tables} worksheets={worksheets} />
                        )}
                    </DynamicDrawer>
                </div>
            </DynamicStack>
        </Box>
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={!!state.data.loading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    </StateMachineDispatch.Provider>
}

export default SheetTabs
