import { ComponentSizes } from "@/constants/ComponentSizes"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassSurface from "../glassmorphism/GlassSurface"
import GlassText from "../glassmorphism/GlassText"
import { useAuth } from "@/contexts/AuthContext"
import AuthModal from "@/auth/AuthModal"
import { Badge, Button, ButtonBase, Drawer, IconButton, Menu, MenuItem, Stack } from "@mui/material"
import { useState } from "react"
import { useSize } from "@/hooks/useSize"
import Sidebar from "./Sidebar"
import { ScreenWidths } from "@/constants/ScreenWidths"
import { Check, Close, MenuTwoTone, Notifications, Settings } from "@mui/icons-material"
import { useLocation } from "react-router"
import { CssSizes } from "@/constants/CssSizes"
import { useDashboard } from "@/contexts/DashboardContext"
import GlassCard from "../glassmorphism/GlassCard"
import { isError } from "@/api/isError"

const TopBar = () => {
    const { updateProperties, properties } = useDashboard()
    const { pathname } = useLocation()
    const { width } = useSize()
    const { user, authAction } = useAuth()
    const [open, setOpen] = useState(false)

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen)
    }

    const unacceptedProjects = properties.projects?.filter(project => !project.inviteAccepted)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const openNotifications = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const respondToProjectInvite = async (projectId: string, response: boolean) => {
        const projectResult = await authAction<void>(`user/respond-to-project-invite`, 'POST', JSON.stringify({ projectId, response }))
        if (!isError(projectResult)) {
            if (response) {
                updateProperties({
                    projects: properties.projects?.map(
                        project => project.id == projectId ? { ...project, inviteAccepted: response } : project
                    )
                })
            } else {
                updateProperties({ projects: properties.projects?.filter(project => project.id != projectId) })
            }
        }
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
                    <ButtonBase href={user?.email_verified ? "/deep-storage" : '/'}>
                        <GlassText size="big">SUBUNIFY</GlassText>
                    </ButtonBase>
                </Stack>
            </GlassSpace>
            <Stack spacing={2} direction='row' paddingRight={CssSizes.moderate}>
                {user ? <>
                    {pathname == '/' && width > ScreenWidths.Tablet && <>
                        <Button variant="outlined" href="/file-upload">Upload</Button>
                        <Button variant="outlined" href="/deep-storage">Manage Files</Button>
                    </>}
                    {width > ScreenWidths.Mobile && <Stack spacing={1} direction='row' paddingRight={CssSizes.small}>
                        <GlassText size="large">{user.firstName}</GlassText>
                        <GlassText size="large">{user.lastName}</GlassText>
                    </Stack>}
                    <IconButton onClick={handleClick} color="primary">
                        <Notifications />
                        <Badge badgeContent={unacceptedProjects?.length} />
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={openNotifications}
                        onClose={handleClose}
                    >
                        {!unacceptedProjects?.length && <GlassSpace size="tiny">
                            <GlassText size="moderate">No New Notifications</GlassText>
                        </GlassSpace>}
                        {unacceptedProjects?.map(project => <GlassCard paddingSize="moderate" marginSize="small">
                            <GlassText size="moderate">{project.owner.firstName} {project.owner.lastName} Invites you to:</GlassText>
                            <div>
                                {project.name}
                                <IconButton onClick={() => respondToProjectInvite(project.id, true)} color="primary">
                                    < Check />
                                </IconButton>
                                <IconButton onClick={() => respondToProjectInvite(project.id, false)} color="primary">
                                    < Close />
                                </IconButton>
                            </div>
                        </GlassCard>)}

                    </Menu>
                    <IconButton onClick={() => updateProperties({ page: 'account' })} color="primary">
                        <Settings />
                    </IconButton>
                </> : <>
                    {pathname == '/' && width > ScreenWidths.Tablet && <>
                        <Button variant="outlined" href="/pricing">Pricing</Button>
                        <Button variant="contained" href="/file-upload">Archive A File</Button>
                    </>}
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