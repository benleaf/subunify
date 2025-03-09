import { useContext, useEffect } from "react";
import Sidebar from "@/components/navigation/Sidebar";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { useSize } from "@/hooks/useSize";
import { ComponentSizes } from "@/constants/ComponentSizes";
import { StateMachineDispatch } from "@/App";
import { ScreenWidths } from "@/constants/ScreenWidths";
import DynamicDrawer from "./glassmorphism/DynamicDrawer";

type Props = {
    children: React.ReactNode | React.ReactNode[]
}

const DashboardLayout = ({ children }: Props) => {
    const context = useContext(StateMachineDispatch)!
    const { height, width } = useSize()

    useEffect(() => {
        context.dispatch({ action: 'startDashboard' })
    }, [])

    const sidebarWidth = width > ScreenWidths.Mobile ? ComponentSizes.sideBar : 0

    return <div style={{ display: 'flex' }}>
        {width > ScreenWidths.Mobile && <Sidebar />}
        <div style={{ height: height - ComponentSizes.topBar, width: width - sidebarWidth }}>
            <GlassCard marginSize="moderate" paddingSize="moderate" height={(height - ComponentSizes.topBar) - 45}>
                {children}
            </GlassCard>
        </div>
        {width <= ScreenWidths.Mobile && <div style={{ flex: 1 }}>
            <DynamicDrawer drawLabel="Menu">
                <Sidebar />
            </DynamicDrawer>
        </div>}
    </div>
}

export default DashboardLayout