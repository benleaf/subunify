import glass from './glass.module.css';
import { classes } from '../../helpers/classes';
import { ReactNode } from 'react';
import { CssSizes } from '../../constants/CssSizes';
import { Sizes } from '@/types/Sizes';
import { Colours } from '@/constants/Colours';

type Props = {
    size: Sizes
    icon: ReactNode,
    children?: ReactNode,
    style?: React.CSSProperties
    color?: keyof typeof Colours
}

const GlassIconText = ({ children, icon, style, size = 'moderate', color = 'darkGrey' }: Props) => {
    return <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ paddingRight: '1em', display: 'flex', alignItems: 'center' }}>{icon}</div>
        <p className={classes(glass.glassText)} style={{ ...style, fontSize: CssSizes[size], color: Colours[color] }}>{children}</p>
    </div>
}

export default GlassIconText