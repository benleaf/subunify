import { useAuth } from "@/contexts/AuthContext"
import { useDashboard } from "@/contexts/DashboardContext"
import { Check, Close, Notifications, Settings } from "@mui/icons-material"
import { IconButton, Badge, Menu } from "@mui/material"
import { useState } from "react"
import GlassCard from "../glassmorphism/GlassCard"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { isError } from "@/api/isError"

const DashboardTopBarOptions = () => {
    const { updateProperties, properties } = useDashboard()
    const { authAction } = useAuth()

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
    </>
}

export default DashboardTopBarOptions