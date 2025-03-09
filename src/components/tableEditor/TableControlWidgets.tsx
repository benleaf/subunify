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
import AuthModal from "@/auth/AuthModal"
import { useAuth } from "@/auth/AuthContext"
import PaymentModal from "../payments/PaymentModal"
import { isExcelImporter } from "@/stateManagement/stateMachines/getContext"
import { TablesDeployer } from "@/helpers/TablesDeployer"
import { User } from "@/types/User"
import { isError } from "@/api/isError"
import { useNavigate } from "react-router"


type Props = {
    tables: SheetTable[],
}

const TableControlWidgets = ({ tables }: Props) => {
    const { user, authAction } = useAuth()
    const navigate = useNavigate()

    const context = useContext(StateMachineDispatch)!
    if (!isExcelImporter(context)) throw new Error("TableControlWidgets can only be used within the excelImporter context");
    const { dispatch, state } = context


    const requestDeployment = async () => {
        dispatch({ action: "setFlowState", data: 'editing' })
        if (!state.data.worksheets) return

        if (!user) {
            dispatch({ action: "setFlowState", data: 'login' })
        } else {
            forcePayment()
        }
    }

    const forcePayment = async () => {
        if (!state.data.worksheets) return
        const userResult = await authAction<User>(`user`, "GET")
        if (isError(userResult)) {
            console.error(userResult)
        } else if (!userResult.stripeSubscriptionId) {
            dispatch({ action: "setFlowState", data: 'payment' })
            TablesDeployer.saveToLocalStore(state.data.tables, state.data.worksheets ?? [])
        } else if (state.data.tables.length > 0) {
            TablesDeployer.saveToLocalStore(state.data.tables, state.data.worksheets ?? [])
            await TablesDeployer.deployFromLocalStore()
            dispatch({ action: "startDashboard" })
            navigate('/dashboard')
        } else {
            dispatch({ action: "startDashboard" })
            navigate('/dashboard')
        }
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
            overrideState={state.data.flowState == 'login'}
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