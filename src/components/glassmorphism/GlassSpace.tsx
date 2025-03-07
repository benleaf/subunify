import { ReactNode } from 'react';
import { CssSizes } from '../../constants/CssSizes';
import { Sizes } from '@/types/Sizes';

type Props = {
    size: Sizes
    children?: ReactNode,
    style?: React.CSSProperties
}

const GlassSpace = ({ children, style, size = 'moderate' }: Props) => {
    return <div style={{ ...style, padding: CssSizes[size], margin: CssSizes[size] }}>{children}</div>
}

export default GlassSpace