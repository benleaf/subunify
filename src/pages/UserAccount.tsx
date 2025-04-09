import { useContext } from "react";
import { StateMachineDispatch } from "@/App";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import GlassText from "@/components/glassmorphism/GlassText";

const UserAccount = () => {
    const { dispatch } = useContext(StateMachineDispatch)!
    const { user, logout } = useAuth()
    const handleLogout = () => {
        dispatch({ action: 'popup', data: { colour: 'success', message: 'Logout successful' } })
        logout()
    }

    return <DashboardLayout>
        <GlassSpace size="small">
            <GlassText size="large">
                User Account for ({user?.email})
            </GlassText>
            <Button onClick={handleLogout}>Logout</Button>
        </GlassSpace>
    </DashboardLayout>
}

export default UserAccount