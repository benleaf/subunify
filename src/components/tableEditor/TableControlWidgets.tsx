import { Button } from "@mui/material"
import TableControlWidget from "./TableControlWidget"
import { useContext } from "react"
import { StateMachineDispatch } from "@/App"
import { SheetTable } from "@/types/spreadsheet/SheetTable"
import { CloudUpload } from "@mui/icons-material"
import GlassCard from "../glassmorphism/GlassCard"
import GlassSpaceBox from "../glassmorphism/GlassSpaceBox"
import GlassText from "../glassmorphism/GlassText"
import { CssSizes } from "@/constants/CssSizes"
import AuthModal from "@/stateManagment/auth/AuthModal"
import { useAuth } from "@/stateManagment/auth/AuthContext"
import PaymentModal from "../payments/PaymentModal"
import { isExcelImporter } from "@/stateManagment/stateMachines/getContext"
import { TablesDeployer } from "@/helpers/TablesDeployer"


type Props = {
    tables: SheetTable[],
}

const TableControlWidgets = ({ tables }: Props) => {
    const auth = useAuth()

    const context = useContext(StateMachineDispatch)!
    if (!isExcelImporter(context)) throw new Error("TableControlWidgets can only be used within the excelImporter context");
    const { dispatch, state } = context


    const requestDeployment = async () => {
        dispatch({ action: "setFlowState", data: 'editing' })
        if (!state.data.worksheets) return

        if (!auth.user) {
            dispatch({ action: "setFlowState", data: 'login' })
        } else {
            forcePayment()
        }
    }

    const forcePayment = async () => {
        if (!state.data.worksheets) return
        dispatch({ action: "setFlowState", data: 'payment' })
        TablesDeployer.saveToLocalStore(state.data.tables, state.data.worksheets ?? [])
    }

    return <GlassCard marginSize="small" paddingSize="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: CssSizes.small }}>
            <GlassText size="huge">
                TABLE CONTROL
            </GlassText>
            <Button
                component="label"
                onClick={requestDeployment}
                variant="contained"
                startIcon={<CloudUpload />}
                style={{ color: 'white' }}
            >
                Deploy to database
            </Button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', height: '77vh', overflow: 'scroll', scrollbarWidth: 'none' }}>
            {tables.map((table, index) => state.data.worksheets &&
                <TableControlWidget
                    table={table}
                    tableIndex={index}
                    worksheet={state.data.worksheets[table.parentWorksheetId]}
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
        <AuthModal
            overideState={state.data.flowState == 'login'}
            onLogin={forcePayment}
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