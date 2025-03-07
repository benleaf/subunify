import { useContext, useEffect } from "react";
import { getResource } from "../api/getResource";
import Sidebar from "@/components/navigation/Sidebar";
import GlassCard from "@/components/glassmorphism/GlassCard";
import GlassText from "@/components/glassmorphism/GlassText";
import TablesTable from "@/components/TablesDataTable/TablesTable";
import { useSize } from "@/hooks/useSize";
import { ComponentSizes } from "@/constants/ComponentSizes";
import CreateChartForm from "@/components/charts/CreateChartForm";
import AuthModal from "@/stateManagement/auth/AuthModal";
import { useAuth } from "@/stateManagement/auth/AuthContext";
import { StateMachineDispatch } from "@/App";
import { isDashboard } from "@/stateManagement/stateMachines/getContext";

const Dashboard = () => {
    const context = useContext(StateMachineDispatch)!
    const auth = useAuth()
    const { height, width } = useSize()

    useEffect(() => {
        context.dispatch({ action: 'startDashboard' })
    }, [])

    useEffect(() => {
        const runFetch = async () => {
            if (isDashboard(context) && context.state.data.loadingData) {
                const resource = await getResource(context.state.data.loadingData)
                context.dispatch({ action: context.state.data.loadingData.request, data: resource })
            }
        }

        runFetch()
    }, [isDashboard(context) && context.state.data.loadingData])

    return isDashboard(context) && <>
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ height: height - ComponentSizes.topBar, width: width - ComponentSizes.sideBar }}>
                <GlassCard marginSize="moderate" paddingSize="moderate" height={(height - ComponentSizes.topBar) - 45}>
                    {context.state.data.selectedScreen == 'Tables' && <>
                        <GlassText size='huge'>{context.state.data.selectedTable?.name ?? 'No Table Selected'}</GlassText>
                        <div style={{ height: height - ComponentSizes.topBar - 120 }}>
                            <TablesTable />
                        </div>
                    </>}
                    {context.state.data.selectedScreen == 'Charts' && context.state.data.tables && <>
                        <CreateChartForm tables={context.state.data.tables} />
                    </>}
                </GlassCard>
            </div>
        </div>
        <AuthModal overrideState={auth.user === null} />
    </>
}

export default Dashboard