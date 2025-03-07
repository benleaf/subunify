import glass from './glass.module.css';
import { classes } from '../../helpers/classes';
import { ReactNode } from 'react';
import { CssSizes } from '../../constants/CssSizes';
import { Sizes } from '@/types/Sizes';

type Props = {
    size: Sizes
    children?: ReactNode,
    style?: React.CSSProperties
}

const GlassText = ({ children, style, size = 'moderate' }: Props) => {
    return <p className={classes(glass.glassText)} style={{ ...style, fontSize: CssSizes[size] }}>{children}</p>
}

export default GlassText