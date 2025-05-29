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
            display: 'flex',
            flexDirection: 'column',
            padding: paddingSize ? CssSizes[paddingSize] : undefined,
            margin: marginSize ? CssSizes[marginSize] : undefined,
            flex,
            width,
            height,
            boxSizing: 'border-box'
        }}
    >{children}</div>
}

export default GlassCard