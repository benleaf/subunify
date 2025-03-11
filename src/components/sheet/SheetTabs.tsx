import { Box, Tabs, Tab } from "@mui/material";
import Sheet from "./Sheet";
import TableControlWidgets from "../tableEditor/TableControlWidgets";
import TableEditor from "../tableEditor/TableEditor";
import GlassCard from "../glassmorphism/GlassCard";
import DynamicStack from "../glassmorphism/DynamicStack";
import DynamicDrawer from "../glassmorphism/DynamicDrawer";
import { StateMachineDispatch } from "@/App";
import { useContext } from "react";
import { isExcelImporter } from "@/stateManagement/stateMachines/getContext";

const SheetTabs = () => {
    const context = useContext(StateMachineDispatch)!
    if (!isExcelImporter(context)) throw new Error("SheetTabs can only be used within the excelImporter context");
    const { dispatch, state } = context

    return state.data.machine == 'excelImporter' && <>
        <Box sx={{ width: '100%', cursor: state.data.cursor ?? 'default' }}>
            <DynamicStack>
                <div style={{ flex: 1 }}>
                    <GlassCard marginSize="small" paddingSize="small">
                        <Tabs
                            value={state.data.worksheetId}
                            onChange={(_: React.SyntheticEvent, newValue: number) => dispatch({ action: "setWorksheet", data: newValue })}
                        >
                            {state.data.worksheets?.map((sheet, key) => <Tab key={key} label={sheet.name} />)}
                        </Tabs>
                    </GlassCard>
                    <GlassCard marginSize="small" paddingSize="small" height='calc(101vh - 170px)'>
                        {state.data.tables &&
                            <Sheet
                                worksheet={state.data.worksheets && state.data.worksheets[state.data.worksheetId]}
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
                        {state.data.selectedTableIndex !== undefined ?
                            <TableEditor
                                table={state.data.tables[state.data.selectedTableIndex]}
                                tableIndex={state.data.selectedTableIndex}
                            /> :
                            <TableControlWidgets tables={state.data.tables} />
                        }
                    </DynamicDrawer>
                </div>
            </DynamicStack>
        </Box>
    </>
}

export default SheetTabs
