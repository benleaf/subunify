import Sidebar from "@/components/navigation/Sidebar";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { useSize } from "@/hooks/useSize";
import { ComponentSizes } from "@/constants/ComponentSizes";
import { ScreenWidths } from "@/constants/ScreenWidths";

type Props = {
    children: React.ReactNode | React.ReactNode[]
}

const DashboardLayout = ({ children }: Props) => {
    const { height, width } = useSize()

    return <>
        <div style={{ display: 'flex' }}>
            {width > ScreenWidths.Mobile && <Sidebar />}
            {width > ScreenWidths.Mobile &&
                <div style={{ height: height - ComponentSizes.topBar, width: width - ComponentSizes.sideBar }}>
                    <GlassCard marginSize="moderate" paddingSize="moderate" height={(height - ComponentSizes.topBar) - 45}>
                        {children}
                    </GlassCard>
                </div>
            }
            {width <= ScreenWidths.Mobile &&
                <div style={{ minHeight: (height - ComponentSizes.topBar) - 45, width: width }}>
                    <GlassCard marginSize="small" paddingSize="small" grow>
                        {children}
                    </GlassCard>
                </div>
            }
        </div>
    </>
}

export default DashboardLayout