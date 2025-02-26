import { Stack, Card, Paper, Button } from "@mui/material"
import TableControlWidget from "./TableControlWidget"
import { Workbook, Worksheet } from "exceljs"
import { useContext } from "react"
import { StateMachineDispatch } from "../sheet/SheetTabs"
import { SheetTable } from "@/types/spreadsheet/SheetTable"
import { TablesDeployer } from "@/helpers/TablesDeployer"
import { CloudUpload } from "@mui/icons-material"
import { useNavigate } from "react-router"
import GlassCard from "../glassmorphism/GlassCard"
import GlassSpaceBox from "../glassmorphism/GlassSpaceBox"
import GlassText from "../glassmorphism/GlassText"
import FloatingGlassCircle from "../glassmorphism/FloatingGlassCircle"
import { CssSizes } from "@/constants/CssSizes"


type Props = {
    worksheets: Worksheet[],
    tables: SheetTable[],
}

const TableControlWidgets = ({ worksheets, tables }: Props) => {
    const navigate = useNavigate();
    const { dispatch, state } = useContext(StateMachineDispatch)!

    const deployTables = async () => {
        if (!worksheets) return
        await TablesDeployer.deploy(state.data.tables, worksheets)
        navigate("/dashboard")
    }

    return <GlassCard marginSize="small" paddingSize="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: CssSizes.small }}>
            <GlassText size="huge">
                TABLE CONTROL
            </GlassText>
            <Button
                component="label"
                onClick={deployTables}
                variant="contained"
                startIcon={<CloudUpload />}
                style={{ color: 'white' }}
            >
                Deploy to database
            </Button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', height: '77vh', overflow: 'scroll', scrollbarWidth: 'none' }}>
            {tables.map((table, index) =>
                <TableControlWidget
                    table={table}
                    tableIndex={index}
                    worksheet={worksheets[table.parentWorksheetId]}
                />
            )}
            <GlassCard marginSize="small" paddingSize="small" flex={1} >
                <GlassSpaceBox>
                    <Button
                        style={{ width: '100%', height: '100%', minHeight: '10em' }}
                        onClick={() => dispatch({ action: "createTable" })}
                    >
                        Create Table
                    </Button>
                </GlassSpaceBox>
            </GlassCard>
        </div>
    </GlassCard>
}

export default TableControlWidgets