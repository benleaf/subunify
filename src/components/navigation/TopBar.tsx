import { ComponentSizes } from "@/constants/ComponentSizes"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassSurface from "../glassmorphism/GlassSurface"
import GlassText from "../glassmorphism/GlassText"
import { useAuth } from "@/auth/AuthContext"
import AuthModal from "@/auth/AuthModal"
import { Button, Drawer, IconButton, Menu, MenuList, Stack } from "@mui/material"
import { StateMachineDispatch } from "@/App"
import { useContext, useState } from "react"
import { useSize } from "@/hooks/useSize"
import Sidebar from "./Sidebar"
import { ScreenWidths } from "@/constants/ScreenWidths"
import { MenuOpen, MenuTwoTone, People } from "@mui/icons-material"

const TopBar = () => {
    const { width } = useSize()
    const { dispatch } = useContext(StateMachineDispatch)!
    const { user, logout } = useAuth()
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };
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
            <Stack direction='row' spacing={1} alignItems='center'>
                {width <= ScreenWidths.Mobile && <>
                    <div>
                        <IconButton onClick={toggleDrawer(true)} color="primary">
                            <MenuTwoTone />
                        </IconButton>
                    </div>
                    <Drawer open={open} onClose={toggleDrawer(false)}>
                        <Sidebar />
                    </Drawer>
                </>
                }
                <GlassText size="huge">SUBUNIFY</GlassText>
            </Stack>
        </GlassSpace>
        {user ?
            <Stack spacing={3} direction='row'>
                <Button onClick={handleLogout}>{user.email}</Button>
            </Stack> :
            <AuthModal />}
    </GlassSurface>
}

export default TopBar