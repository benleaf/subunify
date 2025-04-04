import Sidebar from "@/components/navigation/Sidebar";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { useSize } from "@/hooks/useSize";
import { ComponentSizes } from "@/constants/ComponentSizes";
import { ScreenWidths } from "@/constants/ScreenWidths";
import { useAuth } from "@/auth/AuthContext";

type Props = {
    children: React.ReactNode | React.ReactNode[]
}

const DashboardLayout = ({ children }: Props) => {
    const { subscribed, user } = useAuth()
    const { height, width } = useSize()

    const sideBarVisible = width > ScreenWidths.Mobile && subscribed && user
    const sidebarWidth = sideBarVisible ? ComponentSizes.sideBar : 0

    return <div style={{ display: 'flex' }}>
        {sideBarVisible && <Sidebar />}
        <div style={{ height: height - ComponentSizes.topBar, width: width - sidebarWidth }}>
            <GlassCard marginSize="moderate" paddingSize="moderate" height={(height - ComponentSizes.topBar) - 45}>
                {children}
            </GlassCard>
        </div>
    </div>
}

export default DashboardLayout