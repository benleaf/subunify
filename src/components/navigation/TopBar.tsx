import { ComponentSizes } from "@/constants/ComponentSizes"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassSurface from "../glassmorphism/GlassSurface"
import GlassText from "../glassmorphism/GlassText"
import { useAuth } from "@/stateManagment/auth/AuthContext"
import AuthModal from "@/stateManagment/auth/AuthModal"
import { Button } from "@mui/material"

const TopBar = () => {
    const { user, logout } = useAuth()
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
        {user ? <Button onClick={logout}>{user.email}</Button> : <AuthModal />}
    </GlassSurface>
}

export default TopBar