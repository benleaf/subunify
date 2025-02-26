import glass from './glass.module.css';
import { classes } from '../../helpers/classes';
import React, { ReactNode } from 'react';

type Props = {
    style?: React.CSSProperties
    children?: ReactNode
}

const GlassSurface = ({ children, style }: Props) => {
    return <div className={classes(glass.glass, glass.grow)} style={style}>{children}</div>
}

export default GlassSurface