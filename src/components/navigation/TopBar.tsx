import { ComponentSizes } from "@/constants/ComponentSizes"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassSurface from "../glassmorphism/GlassSurface"
import GlassText from "../glassmorphism/GlassText"
import { useAuth } from "@/contexts/AuthContext"
import AuthModal from "@/auth/AuthModal"
import { Button, ButtonBase, Drawer, IconButton, Stack } from "@mui/material"
import { useState } from "react"
import { useSize } from "@/hooks/useSize"
import Sidebar from "./Sidebar"
import { ScreenWidths } from "@/constants/ScreenWidths"
import { MenuTwoTone, Settings } from "@mui/icons-material"
import { useLocation } from "react-router"
import { CssSizes } from "@/constants/CssSizes"
import DashboardTopBarOptions from "./DashboardTopBarOptions"
import { useDashboard } from "@/contexts/DashboardContext"

type Props = {
    hideDashboardOptions?: boolean
}

const TopBar = ({ hideDashboardOptions = false }: Props) => {
    const { pathname } = useLocation()
    const { width } = useSize()
    const { user } = useAuth()
    const { updateProperties } = useDashboard()
    const [open, setOpen] = useState(false)

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen)
    }

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
                    {width <= ScreenWidths.Tablet && user && <>
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
                    <ButtonBase onClick={() => updateProperties({ page: 'projects' })}>
                        <GlassText size="big">SUBUNIFY</GlassText>
                    </ButtonBase>
                </Stack>
            </GlassSpace>
            <Stack spacing={2} direction='row' paddingRight={CssSizes.moderate}>
                {user ? <>
                    {pathname == '/' && width > ScreenWidths.Tablet && <>
                        <Button variant="outlined" href="/dashboard">Dashboard</Button>
                    </>}
                    {width > ScreenWidths.Mobile && <Stack spacing={1} direction='row' paddingRight={CssSizes.small}>
                        <GlassText size="large">{user.firstName}</GlassText>
                        <GlassText size="large">{user.lastName}</GlassText>
                    </Stack>}
                </> : <>
                    {pathname == '/' && width > ScreenWidths.Tablet && <>
                        <Button variant="outlined" href="/pricing">Pricing</Button>
                        <Button variant="contained" href="/file-upload">Archive A File</Button>
                    </>}
                    <AuthModal />
                </>}
                {!hideDashboardOptions && <DashboardTopBarOptions />}
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