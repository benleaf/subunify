import { ComponentSizes } from "@/constants/ComponentSizes"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassSurface from "../glassmorphism/GlassSurface"
import GlassText from "../glassmorphism/GlassText"
import { useAuth } from "@/auth/AuthContext"
import AuthModal from "@/auth/AuthModal"
import { Button } from "@mui/material"
import { StateMachineDispatch } from "@/App"
import { useContext } from "react"

const TopBar = () => {
    const { dispatch } = useContext(StateMachineDispatch)!
    const { user, logout } = useAuth()

    const handleLogout = () => {
        dispatch({ action: 'popup', data: { colour: 'success', message: 'Logout successful' } })
        logout()
    }

    return <GlassSurface
        style={{
            margin: '0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: ComponentSizes.topBar
        }}
    >
        <GlassSpace size="tiny">
            <GlassText size="huge">SUBUNIFY</GlassText>
        </GlassSpace>
        {user ? <Button onClick={handleLogout}>{user.email}</Button> : <AuthModal />}
    </GlassSurface>
}

export default TopBar