import { Button } from "@mui/material"
import TableControlWidget from "./TableControlWidget"
import { useContext } from "react"
import { StateMachineDispatch } from "@/App"
import { SheetTable } from "@/types/spreadsheet/SheetTable"
import { CloudUpload } from "@mui/icons-material"
import GlassCard from "../glassmorphism/GlassCard"
import GlassText from "../glassmorphism/GlassText"
import { CssSizes } from "@/constants/CssSizes"
import AuthModal from "@/auth/AuthModal"
import PaymentModal from "../payments/PaymentModal"
import { isExcelImporter } from "@/stateManagement/stateMachines/getContext"
import PreDeployModal from "../modal/PreDeployModal"

type Props = {
    tables: SheetTable[],
}

const TableControlWidgets = ({ tables }: Props) => {
    const context = useContext(StateMachineDispatch)!
    if (!isExcelImporter(context)) throw new Error("TableControlWidgets can only be used within the excelImporter context");
    const { dispatch, state } = context


    const requestDeployment = async () => {
        if (!state.data.worksheets) return
        dispatch({ action: "setFlowState", data: 'preDeployWelcome' })
    }

    const addButton = <Button
        fullWidth
        variant="contained"
        onClick={() => dispatch({ action: "createTable" })}
    >
        Create Table
    </Button>

    return <GlassCard marginSize="small" paddingSize="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: CssSizes.small }}>
            <GlassText size="huge">
                TABLE CONTROL
            </GlassText>
            <Button
                component="label"
                onClick={requestDeployment}
                variant={state.data.tables.length ? "contained" : 'outlined'}
                startIcon={<CloudUpload />}
                style={{ color: state.data.tables.length ? 'white' : undefined }}
            >
                Deploy to database
            </Button>
        </div>
        {tables.length === 0 && addButton}
        <div style={{ display: 'flex', flexWrap: 'wrap', height: '77vh', overflow: 'scroll', scrollbarWidth: 'none' }}>
            {tables.map((table, index) => state.data.worksheets &&
                <TableControlWidget
                    table={table}
                    tableIndex={index}
                    worksheet={state.data.worksheets[table.parentWorksheetId]}
                />
            )}
        </div>
        {tables.length > 0 && addButton}
        <PreDeployModal
            isOpen={state.data.flowState === 'preDeployWelcome'}
            onClose={() => dispatch({ action: "setFlowState", data: 'editing' })}
        />
        <AuthModal
            overrideState={state.data.flowState == 'login'}
            onLogin={requestDeployment}
            onAccountCreationCompleate={requestDeployment}
            onClose={() => dispatch({ action: "setFlowState", data: 'editing' })}
            hideButton
        />
        <PaymentModal
            state={state.data.flowState == 'payment' ? 'open' : 'closed'}
            onClose={() => dispatch({ action: "setFlowState", data: 'editing' })}
        />
    </GlassCard>
}

export default TableControlWidgets