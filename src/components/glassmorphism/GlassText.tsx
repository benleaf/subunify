import glass from './glass.module.css';
import { classes } from '../../helpers/classes';
import { ReactNode } from 'react';
import { CssSizes } from '../../constants/CssSizes';
import { Sizes } from '@/types/Sizes';
import { Colours } from '@/constants/Colours';

type Props = {
    size: Sizes
    children?: ReactNode,
    style?: React.CSSProperties
    color?: keyof typeof Colours
}

const GlassText = ({ children, style, size = 'moderate', color = 'primary' }: Props) => {
    return <p
        className={classes(glass.glassText)}
        style={{ fontSize: CssSizes[size], color: Colours[color], ...style }}
    >
        {children}
    </p>
}

export default GlassText