import Sidebar from "@/components/navigation/Sidebar";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { useSize } from "@/hooks/useSize";
import { ComponentSizes } from "@/constants/ComponentSizes";
import { ScreenWidths } from "@/constants/ScreenWidths";
import GlassSurface from "../glassmorphism/GlassSurface";
import { CssSizes } from "@/constants/CssSizes";

type Props = {
    children: React.ReactNode | React.ReactNode[]
}

const DashboardLayout = ({ children }: Props) => {
    const { height, width } = useSize()

    return <>
        <div style={{ display: 'flex' }}>
            {width > ScreenWidths.Tablet && <Sidebar />}
            {width > ScreenWidths.Tablet &&
                <div style={{ height: height - ComponentSizes.topBar, width: width - ComponentSizes.sideBar }}>
                    <GlassCard marginSize="moderate" paddingSize="moderate" height={(height - ComponentSizes.topBar) - 45}>
                        {children}
                    </GlassCard>
                </div>
            }
            {width <= ScreenWidths.Tablet &&
                <div style={{ minHeight: (height - ComponentSizes.topBar) - 175, width: width }}>
                    <GlassSurface style={{ padding: CssSizes.small }}>
                        {children}
                    </GlassSurface>
                </div>
            }
        </div>
    </>
}

export default DashboardLayout