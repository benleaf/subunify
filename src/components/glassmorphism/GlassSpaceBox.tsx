import { ReactNode } from 'react';

type Props = {
    children?: ReactNode,
    style?: React.CSSProperties
}

const GlassSpaceBox = ({ children, style }: Props) => {
    return <div style={{ ...style, minWidth: '20em', display: 'flex', height: '100%', flexDirection: 'column' }}>
        {children}
    </div>
}

export default GlassSpaceBox