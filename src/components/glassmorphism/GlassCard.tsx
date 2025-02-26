import glass from './glass.module.css';
import { classes } from '../../helpers/classes';
import { CSSProperties, ReactNode } from 'react';
import { CssSizes } from '@/constants/CssSizes';
import { Sizes } from '@/types/Sizes';

type Props = {
    children?: ReactNode
    grow?: boolean
    paddingSize?: Sizes
    marginSize?: Sizes
    flex?: number
    width?: CSSProperties['width']
    height?: CSSProperties['height']
}

const GlassCard = ({ children, grow, paddingSize, marginSize, flex, width, height }: Props) => {
    return <div
        className={classes(glass.glass, glass.radius, grow ? glass.grow : undefined)}
        style={{
            padding: paddingSize ? CssSizes[paddingSize] : 0,
            margin: marginSize ? CssSizes[marginSize] : 0,
            flex,
            width,
            height,
            boxSizing: 'border-box'
        }}
    >{children}</div>
}

export default GlassCard