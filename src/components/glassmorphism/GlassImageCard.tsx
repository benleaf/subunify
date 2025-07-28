import { ReactNode } from 'react';
import { Colours } from '@/constants/Colours';
import ColorGlassCard from './ColorGlassCard';

type Props = {
    children?: ReactNode,
    thumbnail?: string
    height?: number
}

const GlassImageCard = ({ thumbnail, height = 60, children }: Props) => {
    return <ColorGlassCard width='100%' paddingSize="tiny" flex={1}>
        <div style={{ display: 'flex', alignItems: 'center', height }}>
            {thumbnail && <>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: Colours.black, width: height * 2 + 20 }} >
                    <div style={{ position: 'relative', width: height * 2 + 21 }}>
                        <img src={thumbnail} height={height + 20} width={height * 2 + 20} style={{ objectFit: 'contain' }} />
                    </div>
                </div >
                <div style={{ width: height * 2 + 20 }} />
            </>}
            {children}
        </div>
    </ColorGlassCard>
}

export default GlassImageCard