import { useSize } from "../../hooks/useSize"
import { BarChart, Calculate, Dashboard, Edit, ListAlt, People, Person, TableChart } from "@mui/icons-material"
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, Stack } from "@mui/material"
import { useContext, useEffect } from "react"
import GlassText from "../glassmorphism/GlassText"
import { ComponentSizes } from "@/constants/ComponentSizes"
import { CssSizes } from "@/constants/CssSizes"
import { useAuth } from "@/auth/AuthContext"
import { isDashboard } from "@/stateManagement/stateMachines/getContext"
import { StateMachineDispatch } from "@/App"
import { useNavigate } from "react-router"
import { TableResult } from "@/types/server/TableResult"
import { isError } from "@/api/isError"
import { ServerTable } from "@/types/application/ServerTable"

const Sidebar = () => {
    const navigate = useNavigate()
    const { height } = useSize()
    const { authAction, user } = useAuth()

    const context = useContext(StateMachineDispatch)!
    if (!isDashboard(context)) throw new Error("Sidebar can only be used within the dashboard context");
    const { dispatch, state } = context

    useEffect(() => {
        const getTables = async () => {
            context.dispatch({ action: 'loading', data: true })
            const result = await authAction<TableResult[]>('table', 'GET')
            context.dispatch({ action: 'loading', data: false })
            if (isError(result)) {
                console.error(result)
            } else {
                const sorted = result.sort((a, b) => a.name.localeCompare(b.name))
                context.dispatch({ action: 'tableGetAll', data: sorted })
            }
        }
        getTables()
    }, [user])

    const comingSoon = () => {
        dispatch({ action: 'popup', data: { colour: 'info', message: 'This page is in development and will be coming soon!' } })
    }

    const getTable = async (tableId: string) => {
        const result = await authAction<ServerTable>(`table/${tableId}`, 'GET')
        if (isError(result)) {
            console.error(result)
        } else {
            context.dispatch({ action: 'tableGetBodyById', data: result })
        }
    }

    const tableClicked = async (tableId: string) => {
        context.dispatch({ action: 'loading', data: true })
        navigate('/dashboard')
        if (state.data.selectedScreen != 'Tables') {
            dispatch({
                action: 'setSelectedScreen',
                data: 'Tables'
            })
        }
        await getTable(tableId)
        context.dispatch({ action: 'loading', data: false })
    }

    const chartClicked = () => {
        dispatch({
            action: 'setSelectedScreen',
            data: 'Charts'
        })
    }

    return <div style={{
        height: height - ComponentSizes.topBar,
        width: ComponentSizes.sideBar,
        overflow: 'scroll',
        scrollbarWidth: 'none'
    }}>
        <Stack margin={CssSizes.moderate}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <GlassText size="moderate" >Tables</GlassText>
                <IconButton href="/table-manager" size="small" style={{ padding: 0 }}>
                    <Edit color="primary" />
                </IconButton>
            </div>
            <List dense>
                {state.data.tables?.filter(table => table.visible).map(table =>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => tableClicked(table.id)}>
                            <ListItemIcon>
                                <TableChart />
                            </ListItemIcon>
                            <GlassText size="small">{table.name}</GlassText>
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
            <GlassText size="moderate">Charts</GlassText>
            <List dense>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => chartClicked()}>
                        <ListItemIcon>
                            <BarChart />
                        </ListItemIcon>
                        <GlassText size="small">Charts Manager</GlassText>
                    </ListItemButton>
                </ListItem>
            </List>

            <GlassText size="moderate">Users (Coming Soon)</GlassText>
            <List dense>
                <ListItem disablePadding>
                    <ListItemButton onClick={comingSoon}>
                        <ListItemIcon>
                            <Person />
                        </ListItemIcon>
                        <GlassText size="small">Permissions</GlassText>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={comingSoon}>
                        <ListItemIcon>
                            <People />
                        </ListItemIcon>
                        <GlassText size="small">Manage Users</GlassText>
                    </ListItemButton>
                </ListItem>
            </List>

            <GlassText size="moderate">Presentation (Coming Soon)</GlassText>
            <List dense>
                <ListItem disablePadding>
                    <ListItemButton onClick={comingSoon}>
                        <ListItemIcon>
                            <Calculate />
                        </ListItemIcon>
                        <GlassText size="small">Equations</GlassText>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={comingSoon}>
                        <ListItemIcon>
                            <Dashboard />
                        </ListItemIcon>
                        <GlassText size="small">Dashboards</GlassText>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={comingSoon}>
                        <ListItemIcon>
                            <ListAlt />
                        </ListItemIcon>
                        <GlassText size="small">Forms</GlassText>
                    </ListItemButton>
                </ListItem>
            </List>
        </Stack>
    </div>
}

export default Sidebar