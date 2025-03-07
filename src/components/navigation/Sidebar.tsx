import { useSize } from "../../hooks/useSize"
import { ExpandMore, TableChart } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material"
import { useContext, useEffect } from "react"
import GlassText from "../glassmorphism/GlassText"
import { ComponentSizes } from "@/constants/ComponentSizes"
import { CssSizes } from "@/constants/CssSizes"
import { useAuth } from "@/stateManagment/auth/AuthContext"
import { isDashboard } from "@/stateManagment/stateMachines/getContext"
import { StateMachineDispatch } from "@/App"

const Sidebar = () => {
    const { height } = useSize()
    const auth = useAuth()

    const context = useContext(StateMachineDispatch)!
    if (!isDashboard(context)) throw new Error("Sidebar can only be used within the dashboard context");
    const { dispatch, state } = context

    useEffect(() => {
        dispatch({ action: 'loadData', data: { request: 'tableGetAll' } })
    }, [auth])

    useEffect(() => {
        if (state.data.tables && state.data.tables.length > 0) {
            dispatch({
                action: 'loadData',

                data: { request: 'tableGetBodyById', resources: { params: { tableId: state.data.tables[0].id } } }
            })
        }
    }, [state.data.tables === undefined])

    const tableClicked = (tableId: string) => {
        if (state.data.selectedScreen != 'Tables') {
            dispatch({
                action: 'setSelectedScreen',
                data: 'Tables'
            })
        }
        dispatch({
            action: 'loadData',

            data: { request: 'tableGetBodyById', resources: { params: { tableId } } }
        })
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
        <Stack margin={CssSizes.modrate}>
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />} >
                    <GlassText size="large">Tables</GlassText>
                </AccordionSummary>
                <AccordionDetails>
                    <List sx={{ padding: 0 }}>
                        {state.data.tables?.map(table =>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => tableClicked(table.id)}>
                                    <ListItemIcon>
                                        <TableChart />
                                    </ListItemIcon>
                                    <ListItemText primary={table.name} />
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />} >
                        <GlassText size="large">Charts</GlassText>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List sx={{ padding: 0 }}>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => chartClicked()}>
                                    <ListItemIcon>
                                        <TableChart />
                                    </ListItemIcon>
                                    <ListItemText primary='Add Chart' />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </AccordionDetails>
                </Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} >
                    <GlassText size="large">Equations</GlassText>
                </AccordionSummary>
                <AccordionDetails>
                    <GlassText size="small">Comming Soon!</GlassText>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} >
                    <GlassText size="large">Access Control</GlassText>
                </AccordionSummary>
                <AccordionDetails>
                    <GlassText size="small">Comming Soon!</GlassText>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} >
                    <GlassText size="large">Dashboards</GlassText>
                </AccordionSummary>
                <AccordionDetails>
                    <GlassText size="small">Comming Soon!</GlassText>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} >
                    <GlassText size="large">Formes</GlassText>
                </AccordionSummary>
                <AccordionDetails>
                    <GlassText size="small">Comming Soon!</GlassText>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} >
                    <GlassText size="large">Users</GlassText>
                </AccordionSummary>
                <AccordionDetails>
                    <GlassText size="small">Comming Soon!</GlassText>
                </AccordionDetails>
            </Accordion>
        </Stack>
    </div>
}

export default Sidebar