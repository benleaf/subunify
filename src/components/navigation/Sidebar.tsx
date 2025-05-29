import { useSize } from "../../hooks/useSize"
import { Add, BarChart, Folder, ListAlt, Payment, Settings } from "@mui/icons-material"
import { List, ListItem, ListItemButton, ListItemIcon, Stack } from "@mui/material"
import GlassText from "../glassmorphism/GlassText"
import { ComponentSizes } from "@/constants/ComponentSizes"
import { CssSizes } from "@/constants/CssSizes"
import { useDashboard } from "@/contexts/DashboardContext"

const Sidebar = () => {
    const { updateProperties } = useDashboard()
    const { height } = useSize()

    return <div style={{
        height: height - ComponentSizes.topBar,
        width: ComponentSizes.sideBar,
        overflow: 'scroll',
        scrollbarWidth: 'none'
    }}>
        <Stack margin={CssSizes.moderate}>
            <GlassText size="moderate">Recent Projects</GlassText>
            <List dense>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Folder color="error" />
                        </ListItemIcon>
                        <GlassText size="small">Apple V1</GlassText>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Folder color="error" />
                        </ListItemIcon>
                        <GlassText size="small">Samsung Project Duo</GlassText>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Folder color="error" />
                        </ListItemIcon>
                        <GlassText size="small">Trader Joe's Project #5</GlassText>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Folder color="error" />
                        </ListItemIcon>
                        <GlassText size="small">FedEx Synth Wave Commercial</GlassText>
                    </ListItemButton>
                </ListItem>
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
                    <ListItemButton href='/start-project'>
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
                    <ListItemButton>
                        <ListItemIcon>
                            <BarChart />
                        </ListItemIcon>
                        <GlassText size="small">Statistics</GlassText>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Payment />
                        </ListItemIcon>
                        <GlassText size="small">Billing</GlassText>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
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