import { useContext, useState } from "react";
import { StateMachineDispatch } from "@/App";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/auth/AuthContext";
import { Button, Divider, Stack, TextField } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import GlassText from "@/components/glassmorphism/GlassText";
import { isError } from "@/api/isError";
import BaseModal from "@/components/modal/BaseModal";
import { CssSizes } from "@/constants/CssSizes";
import { useNavigate } from "react-router";

const UserAccount = () => {
    const { dispatch } = useContext(StateMachineDispatch)!
    const navigate = useNavigate()
    const { user, logout, authAction } = useAuth()
    const [endSubscriptionModal, setEndSubscriptionModal] = useState(false)
    const [conformationMessage, setConformationMessage] = useState('')
    const handleLogout = () => {
        dispatch({ action: 'popup', data: { colour: 'success', message: 'Logout successful' } })
        logout()
        navigate('/')
    }

    const handleEndSubscription = async () => {
        const sessionResult = await authAction<null>(`user/end-subscription`, "DELETE");
        if (isError(sessionResult) && sessionResult.message == 'Unauthorized') {
            return
        }
        if (isError(sessionResult)) {
            dispatch({ action: 'popup', data: { colour: 'error', message: 'Unable to end subscription, please contact support' } })
            setEndSubscriptionModal(false)
            return
        }
        dispatch({ action: 'popup', data: { colour: 'success', message: 'Subscription ended successful, all files deleted' } })
        setEndSubscriptionModal(false)
    }

    return <DashboardLayout>
        <GlassSpace size="small">
            <Stack spacing={1}>
                <GlassText size="large">
                    User Account for ({user?.email})
                </GlassText>
                <Divider />
                <GlassText size="moderate">
                    For any specific requests please contact us at:
                </GlassText>
                <GlassText size="moderate">product@subunify.com</GlassText>
                <Divider />
                <div>
                    <Button onClick={handleLogout}>Logout</Button>
                    <Button color="error" onClick={() => setEndSubscriptionModal(true)}>End Subscription</Button>
                </div>
            </Stack>
        </GlassSpace>
        <BaseModal state={endSubscriptionModal ? 'open' : 'closed'} close={() => setEndSubscriptionModal(false)} maxWidth={600}>
            <GlassSpace size='moderate'>
                <GlassText size='large'>End Subscription</GlassText>
                <div style={{ display: "flex", flexWrap: 'wrap', paddingBottom: CssSizes.small }}>
                    <GlassText size='moderate'>
                        This action will end your current subscription, charge you for any usage this Month
                        and delete all your files. Once deleted, files cannot be recovered.
                    </GlassText>
                    <GlassText size='moderate' style={{ marginTop: CssSizes.moderate }}>
                        Ensure you have backups of all files before proceeding.
                    </GlassText>
                    <Divider style={{ width: '100%', margin: CssSizes.moderate }} />
                    <GlassText size='moderate'>To end subscription please type:</GlassText>
                    <GlassText size='large'>end subscription and delete all files</GlassText>
                    <TextField fullWidth onChange={(e) => setConformationMessage(e.target.value)}></TextField>
                </div>
                <Button
                    color="error"
                    disabled={conformationMessage.toLocaleLowerCase() != 'end subscription and delete all files'}
                    fullWidth variant="outlined"
                    onClick={() => handleEndSubscription()}
                >
                    End Subscription
                </Button>
            </GlassSpace>
        </BaseModal>
    </DashboardLayout>
}

export default UserAccount
