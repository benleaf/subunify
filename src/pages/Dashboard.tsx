import { useContext, useEffect } from "react";
import GlassText from "@/components/glassmorphism/GlassText";
import TablesTable from "@/components/TablesDataTable/TablesTable";
import { useSize } from "@/hooks/useSize";
import { ComponentSizes } from "@/constants/ComponentSizes";
import CreateChartForm from "@/components/charts/CreateChartForm";
import { StateMachineDispatch } from "@/App";
import { isDashboard } from "@/stateManagement/stateMachines/getContext";
import DashboardLayout from "@/components/DashboardLayout";

const Dashboard = () => {
    const context = useContext(StateMachineDispatch)!
    const { height } = useSize()

    useEffect(() => {
        context.dispatch({ action: 'startDashboard' })
    }, [])

    return isDashboard(context) && <DashboardLayout>
        {context.state.data.selectedScreen == 'Tables' && <>
            <GlassText size='huge'>{context.state.data.selectedTable?.name ?? 'No Table Selected'}</GlassText>
            <div style={{ height: height - ComponentSizes.topBar - 120 }}>
                <TablesTable />
            </div>
        </>}
        {context.state.data.selectedScreen == 'Charts' && context.state.data.tables && <>
            <CreateChartForm tables={context.state.data.tables} />
        </>}
    </DashboardLayout>
}

export default Dashboard