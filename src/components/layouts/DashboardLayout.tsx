import Sidebar from "@/components/navigation/Sidebar";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { useSize } from "@/hooks/useSize";
import { ComponentSizes } from "@/constants/ComponentSizes";
import { ScreenWidths } from "@/constants/ScreenWidths";
import GlassSurface from "../glassmorphism/GlassSurface";
import { CssSizes } from "@/constants/CssSizes";
import TopBar from "../navigation/TopBar";
import CollaboratorsPanel from "../navigation/CollaboratorsPanel";

type Props = {
    children: React.ReactNode | React.ReactNode[]
}

const DashboardLayout = ({ children }: Props) => {
    const { height, width } = useSize()
    const sideBarsWidth = width > ScreenWidths.Tablet ? ComponentSizes.sideBar * 2 : 0

    return <>
        <TopBar />
        <div style={{ display: 'flex' }}>
            {width > ScreenWidths.Tablet && <Sidebar />}
            <div style={{ minHeight: (height - ComponentSizes.topBar) - 175, width: width - sideBarsWidth }}>
                <GlassSurface style={{ padding: CssSizes.small }}>
                    {children}
                </GlassSurface>
            </div>
            {width > ScreenWidths.Tablet && <CollaboratorsPanel />}
        </div>
    </>
}

export default DashboardLayout