import { ComponentSizes } from "@/constants/ComponentSizes"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassSurface from "../glassmorphism/GlassSurface"
import GlassText from "../glassmorphism/GlassText"
import { useAuth } from "@/auth/AuthContext"
import AuthModal from "@/auth/AuthModal"
import { Button, ButtonBase, Drawer, IconButton, Stack } from "@mui/material"
import { useState } from "react"
import { useSize } from "@/hooks/useSize"
import Sidebar from "./Sidebar"
import { ScreenWidths } from "@/constants/ScreenWidths"
import { MenuTwoTone, Settings } from "@mui/icons-material"
import { useLocation } from "react-router"
import { CssSizes } from "@/constants/CssSizes"

const TopBar = () => {
    const { pathname } = useLocation()
    const { width } = useSize()
    const { user } = useAuth()
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return <>
        <GlassSurface
            style={{
                margin: '0px',
                display: 'flex',
                alignItems: 'center',
                width: "100%",
                zIndex: 3,
                position: 'fixed',
                justifyContent: 'space-between',
                height: ComponentSizes.topBar
            }}
        >
            <GlassSpace size="tiny">
                <Stack direction='row' spacing={1} alignItems='center'>
                    {width <= ScreenWidths.Mobile && user && <>
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
                    <ButtonBase href={user?.email_verified ? "/deep-storage" : '/'}>
                        <GlassText size="huge">SUBUNIFY</GlassText>
                    </ButtonBase>
                </Stack>
            </GlassSpace>
            <Stack spacing={2} direction='row' paddingRight={CssSizes.moderate}>
                {user ? <>
                    {pathname == '/' && width > ScreenWidths.Mobile && <>
                        <Button variant="outlined" href="/file-upload">Upload</Button>
                        <Button variant="outlined" href="/deep-storage">Manage Files</Button>
                    </>}
                    <IconButton href="/user-account" color="primary">
                        <Settings />
                    </IconButton>
                </> : <>
                    {pathname == '/' && width > ScreenWidths.Mobile &&
                        <Button variant="contained" href="/file-upload">Archive A File</Button>
                    }
                    <AuthModal />
                </>}
            </Stack>
        </GlassSurface >

        <div style={{
            margin: '0px',
            width: "100%",
            height: ComponentSizes.topBar
        }} />
    </>
}

export default TopBar