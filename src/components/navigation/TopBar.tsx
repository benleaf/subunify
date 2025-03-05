import { ComponentSizes } from "@/constants/ComponentSizes"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassSurface from "../glassmorphism/GlassSurface"
import GlassText from "../glassmorphism/GlassText"

const TopBar = () => {
    return <GlassSurface
        style={{
            margin: '0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: ComponentSizes.topBar
        }}
    >
        <GlassSpace size="tiny">
            <GlassText size="huge">• SUBUNIFY</GlassText>
        </GlassSpace>
        <GlassSpace size="tiny">
            <GlassText size="modrate">LOGIN</GlassText>
        </GlassSpace>
    </GlassSurface>
}

export default TopBar