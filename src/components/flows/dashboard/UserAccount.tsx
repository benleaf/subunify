import { useAuth } from "@/contexts/AuthContext";
import { Button, Divider, Stack } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import GlassText from "@/components/glassmorphism/GlassText";
import { useNavigate } from "react-router";

const UserAccount = () => {
    const navigate = useNavigate()
    const { user, logout, setAlert } = useAuth()
    const handleLogout = () => {
        setAlert('Logout successful', 'success')
        logout()
        navigate('/')
    }

    return <>
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
                </div>
            </Stack>
        </GlassSpace>

        <div style={{ position: 'absolute', right: 0, bottom: 0 }}>
            <a href="/privacy-policy" style={{ paddingRight: '1em' }}>Privacy Policy</a>
            <a href="/terms-of-service">Terms Of Service</a>
        </div>
    </>
}

export default UserAccount
