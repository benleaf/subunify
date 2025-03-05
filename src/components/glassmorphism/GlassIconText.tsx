import glass from './glass.module.css';
import { classes } from '../../helpers/classes';
import { ReactNode } from 'react';
import { CssSizes } from '../../constants/CssSizes';
import { Sizes } from '@/types/Sizes';

type Props = {
    size: Sizes
    icon: ReactNode,
    children?: ReactNode,
    style?: React.CSSProperties
}

const GlassIconText = ({ children, icon, style, size = 'modrate' }: Props) => {
    return <div style={{ display: 'flex' }}>
        <div style={{ paddingRight: '1em' }}>{icon}</div>
        <p className={classes(glass.glassText)} style={{ ...style, fontSize: CssSizes[size] }}>{children}</p>
    </div>
}

export default GlassIconText