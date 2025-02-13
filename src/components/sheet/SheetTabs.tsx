import { Box, Tabs, Tab, Stack } from "@mui/material";
import { Workbook } from "exceljs"
import { createContext, Dispatch, useReducer } from "react";
import Sheet from "./Sheet";
import { reducer } from "../../reducers/SheetStateMachineReducer";
import { ViewerState } from "../../stateMachine/ViewerState";
import { SheetEvents } from "@/types/SheetEvents";
import TableControlWidgets from "../tableEditor/TableControlWidgets";
import TableEditor from "../tableEditor/TableEditor";
import { VirtuosoTable } from "./VirtuosoTable";

type Props = {
    workbook: Workbook
}

export const StateMachineDispatch = createContext<Dispatch<SheetEvents> | undefined>(undefined);

const SheetTabs = ({ workbook }: Props) => {
    const useMySheet = true
    const [state, dispatch] = useReducer(reducer, new ViewerState({
        scroll: { x: 1, y: 1 },
        mousePossition: { x: 1, y: 1 },
        tables: [],
        worksheetId: 0
    }));

    return <StateMachineDispatch.Provider value={dispatch}>
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={state.data.worksheetId}
                    onChange={(_: React.SyntheticEvent, newValue: number) => dispatch({ action: "setWorksheet", data: newValue })}
                >
                    {workbook.worksheets.map((sheet, key) => <Tab key={key} label={sheet.name} />)}
                </Tabs>
            </Box>
            <Stack direction="row">
                <div

                    style={{ flex: 1, height: '90vh' }}
                >
                    {state.data.tables &&
                        <Sheet
                            worksheet={workbook.worksheets[state.data.worksheetId]}
                            worksheetId={state.data.worksheetId}
                            selectedTableIndex={state.data.selectedTableIndex}
                            sheetTables={state.data.tables}
                            selectedCell={state.data.selectedCell}
                            possition={{ x: state.data.scroll.x ?? 1, y: state?.data.scroll.y ?? 1 }}
                        />
                    }
                </div>
                {state.data.selectedTableIndex !== undefined ?
                    <TableEditor
                        table={state.data.tables[state.data.selectedTableIndex]}
                        worksheets={workbook.worksheets}
                        tableIndex={state.data.selectedTableIndex}
                    /> :
                    <TableControlWidgets tables={state.data.tables} workbook={workbook} />
                }
            </Stack>
        </Box>
    </StateMachineDispatch.Provider>
}

export default SheetTabs
