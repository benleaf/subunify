import { useSize } from "../../hooks/useSize"
import { Add, BarChart, Folder, ListAlt, Payment, Settings } from "@mui/icons-material"
import { List, ListItem, ListItemButton, ListItemIcon, Stack } from "@mui/material"
import GlassText from "../glassmorphism/GlassText"
import { ComponentSizes } from "@/constants/ComponentSizes"
import { CssSizes } from "@/constants/CssSizes"
import { useDashboard } from "@/contexts/DashboardContext"
import { useAuth } from "@/contexts/AuthContext"
import { Time } from "@/helpers/Time"

const Sidebar = () => {
    const { setAlert } = useAuth()
    const { updateProperties, properties, loadProject } = useDashboard()
    const { height } = useSize()

    const orderedProjects = properties.projects?.sort((a, b) => Time.compare(b.modified, a.modified)).slice(0, 5)

    const setProject = (projectId: string) => {
        loadProject(projectId)
        updateProperties({ page: 'project', selectedProjectId: projectId })
    }

    return <div style={{
        height: height - ComponentSizes.topBar,
        width: ComponentSizes.sideBar,
        overflow: 'scroll',
        scrollbarWidth: 'none'
    }}>
        <Stack margin={CssSizes.moderate}>
            <GlassText size="moderate">Recent Projects</GlassText>
            <List dense>
                {orderedProjects?.map(project =>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setProject(project.id)}>
                            <ListItemIcon>
                                <Folder color="primary" />
                            </ListItemIcon>
                            <GlassText size="small">{project.name}</GlassText>
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
            <GlassText size="moderate">Projects</GlassText>
            <List dense>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => updateProperties({ page: 'projects' })}>
                        <ListItemIcon>
                            <ListAlt />
                        </ListItemIcon>
                        <GlassText size="small">View All</GlassText>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => updateProperties({ page: 'createProject' })}>
                        <ListItemIcon>
                            <Add />
                        </ListItemIcon>
                        <GlassText size="small">Create New Project</GlassText>
                    </ListItemButton>
                </ListItem>
            </List>
            <GlassText size="moderate">Overview</GlassText>
            <List dense>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => setAlert('This area is coming soon! Contact us at product@subunify.com', 'info')}>
                        <ListItemIcon>
                            <BarChart />
                        </ListItemIcon>
                        <GlassText size="small">Statistics</GlassText>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => updateProperties({ page: 'billing' })}>
                        <ListItemIcon>
                            <Payment />
                        </ListItemIcon>
                        <GlassText size="small">Billing</GlassText>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => updateProperties({ page: 'account' })}>
                        <ListItemIcon>
                            <Settings />
                        </ListItemIcon>
                        <GlassText size="small">Settings</GlassText>
                    </ListItemButton>
                </ListItem>
            </List>
        </Stack>
    </div>
}

export default Sidebar