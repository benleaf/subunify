import { Button, Divider, Stack } from "@mui/material";
import GlassSpace from "../glassmorphism/GlassSpace";
import BaseModal from "./BaseModal";
import GlassText from "../glassmorphism/GlassText";
import { useContext, useEffect } from "react";
import { StateMachineDispatch } from "@/App";
import { isExcelImporter } from "@/stateManagement/stateMachines/getContext";
import { TablesDeployer } from "@/helpers/TablesDeployer";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";
import { isError } from "@/api/isError";
import { User } from "@/types/User";

type Props = {
    isOpen: boolean,
    onClose: () => void
}

const PreDeployModal = ({ isOpen, onClose }: Props) => {
    const context = useContext(StateMachineDispatch)!
    if (!isExcelImporter(context)) throw new Error("TableControlWidgets can only be used within the excelImporter context");
    const { dispatch, state } = context
    const { user, authAction } = useAuth()

    useEffect(() => {
        if (!user && isOpen) {
            context.dispatch({ action: 'setFlowState', data: 'login' })
        }
    }, [user, isOpen])

    const navigate = useNavigate()

    const forcePayment = async () => {
        if (!state.data.worksheets) return
        const userResult = await authAction<User>(`user`, "GET")
        if (isError(userResult)) {
            console.error(userResult)
            dispatch({ action: 'popup', data: { colour: 'error', message: 'Failed to find or create new user' } })
        } else if (!userResult.stripeSubscriptionId) {
            dispatch({ action: "setFlowState", data: 'payment' })
        } else if (state.data.tables.length > 0) {
            await TablesDeployer.deployFromLocalStore()
            dispatch({ action: "startDashboard" })
            navigate('/dashboard')
        } else {
            dispatch({ action: "startDashboard" })
            navigate('/dashboard')
        }
    }

    const onAccept = () => {
        TablesDeployer.saveToLocalStore(state.data.tables, state.data.worksheets ?? [])
        if (TablesDeployer.confirmSuccessfulStore()) {
            dispatch({ action: 'popup', data: { colour: 'success', message: 'Deployment setup compleat' } })
            forcePayment()
        } else {
            dispatch({ action: 'popup', data: { colour: 'error', message: 'Deployment setup failed, please review your tables' } })
        }
    }

    return <BaseModal state={isOpen ? 'open' : 'closed'}>
        <GlassSpace size="moderate" style={{ maxHeight: '80vh', overflowY: 'scroll', }}>
            <Stack spacing={2}>
                <GlassText size='large'>Start Deployment</GlassText>
                <GlassText size='moderate'>Are you sure you wish to deploy the selected data?</GlassText>
                <Divider />
                <Stack direction='row' spacing={2}>
                    <Button
                        style={{ flex: 1 }}
                        variant="outlined"
                        onClick={onAccept}
                    >
                        Yes
                    </Button>
                    <Button
                        style={{ flex: 1 }}
                        variant="contained"
                        onClick={onClose}
                    >
                        No
                    </Button>
                </Stack>
            </Stack>
        </GlassSpace>
    </BaseModal>
};

export default PreDeployModal