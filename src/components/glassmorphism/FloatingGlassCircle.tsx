import { CSSProperties } from "react"
import GlassCircle from "./GlassCircle"

type Props = {
    size?: "small" | "medium" | "large",
    offset?: {
        top?: CSSProperties['top'],
        right?: CSSProperties['right'],
        bottom?: CSSProperties['bottom'],
        left?: CSSProperties['left'],
    }
}

const FloatingGlassCircle = ({ offset, size = "medium" }: Props) => {
    return <div style={{ position: 'relative', marginRight: '5em', zIndex: -100 }}>
        <div style={{ position: 'absolute', ...offset }}>
            <GlassCircle size={size} />
        </div>
    </div>
}

export default FloatingGlassCircle