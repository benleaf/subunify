import { Button } from "@mui/material"
import TableControlWidget from "./TableControlWidget"
import { Worksheet } from "exceljs"
import { useContext } from "react"
import { StateMachineDispatch } from "../sheet/SheetTabs"
import { SheetTable } from "@/types/spreadsheet/SheetTable"
import { TablesDeployer } from "@/helpers/TablesDeployer"
import { CloudUpload } from "@mui/icons-material"
import { useNavigate } from "react-router"
import GlassCard from "../glassmorphism/GlassCard"
import GlassSpaceBox from "../glassmorphism/GlassSpaceBox"
import GlassText from "../glassmorphism/GlassText"
import { CssSizes } from "@/constants/CssSizes"
import AuthModal from "@/stateManagment/auth/AuthModal"
import { useAuth } from "@/stateManagment/auth/AuthContext"
import PaymentModal from "../payments/PaymentModal"


type Props = {
    worksheets: Worksheet[],
    tables: SheetTable[],
}

const TableControlWidgets = ({ worksheets, tables }: Props) => {
    const navigate = useNavigate();
    const auth = useAuth()
    const { dispatch, state } = useContext(StateMachineDispatch)!

    const requestDeployment = async () => {
        dispatch({ action: "setFlowState", data: 'editing' })
        if (!worksheets) return

        if (!auth.user) {
            dispatch({ action: "setFlowState", data: 'login' })
        } else {
            forcePayment()
        }
    }

    const forcePayment = async () => {
        if (!worksheets) return
        dispatch({ action: "setFlowState", data: 'payment' })
    }

    const onFormCompleate = async (result: "success" | "incompleate") => {
        dispatch({ action: "setFlowState", data: 'dashboard' })

        if (result == 'success') {
            deploy()
        }
    }

    const deploy = async () => {
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
                onClick={requestDeployment}
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
        <AuthModal
            overideState={state.data.flowState == 'login'}
            onLogin={forcePayment}
            onAccountCreationCompleate={requestDeployment}
            onClose={() => dispatch({ action: "setFlowState", data: 'editing' })}
            hideButton
        />
        <PaymentModal overideState={state.data.flowState == 'payment'} onFinish={onFormCompleate} />
    </GlassCard>
}

export default TableControlWidgets