import glass from './glass.module.css';
import { classes } from '../../helpers/classes';
import { CSSProperties, ReactNode } from 'react';
import { CssSizes } from '@/constants/CssSizes';
import { Sizes } from '@/types/Sizes';
import { Colours } from '@/constants/Colours';

type Props = {
    color?: string
    children?: ReactNode
    grow?: boolean
    paddingSize?: Sizes
    marginSize?: Sizes
    flex?: CSSProperties['flex']
    width?: CSSProperties['width']
    height?: CSSProperties['height']
    onClick?: () => void
    style?: CSSProperties
}

const ColorGlassCard = ({ color = Colours.primary, children, grow, paddingSize, marginSize, flex, width, height, onClick, style }: Props) => {
    return <div
        className={classes(glass.glass, glass.radius, grow ? glass.grow : undefined)}
        onClick={onClick}
        style={{
            ...style,
            display: 'flex',
            position: 'relative',
            overflow: 'hidden',
            flexDirection: 'column',
            padding: paddingSize ? CssSizes[paddingSize] : undefined,
            margin: marginSize ? CssSizes[marginSize] : undefined,
            flex,
            width,
            height,
            boxSizing: 'border-box',
            borderLeftColor: color,
            borderLeftStyle: 'solid',
            borderLeftWidth: 5,
            cursor: onClick && 'pointer'
        }}
    >{children}</div>
}

export default ColorGlassCard