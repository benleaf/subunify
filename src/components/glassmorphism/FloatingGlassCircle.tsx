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
    return <div style={{ position: 'relative', marginRight: '5em' }}>
        <div style={{ position: 'absolute', ...offset, zIndex: -100 }}>
            <GlassCircle size={size} />
        </div>
    </div>
}

export default FloatingGlassCircle