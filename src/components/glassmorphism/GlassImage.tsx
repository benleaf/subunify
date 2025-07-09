import { Fullscreen, FullscreenExit, Rotate90DegreesCw } from '@mui/icons-material'
import { IconButton, Modal } from '@mui/material'
import { CSSProperties, useEffect, useRef, useState } from 'react'
import { Colours } from '@/constants/Colours'
import { useSize } from '@/hooks/useSize'


type GlassImageFrameProps = {
    height?: number
    imageState: VideoState,
    setImageState: (value: React.SetStateAction<VideoState>) => void
}

const GlassImageFrame = ({ height = 400, imageState, setImageState }: GlassImageFrameProps) => {
    const { rotation, fullscreen, src } = imageState
    const image = useRef<HTMLImageElement>(null)

    useEffect(() => {
        setImageState(old => ({ ...old, rotation: +(rotation ?? '0') }))
    }, [])

    const updateRotation = () => {
        const newRotation = (rotation + 90) % 360
        setImageState(old => ({ ...old, rotation: newRotation }))
    }

    const showFullscreen = async () => {
        setImageState(old => ({ ...old, fullscreen: true }))
    }

    const landscape = rotation == 0 || rotation == 180
    const rotateCss = {
        transform: `rotate(${rotation}deg)`,
        width: landscape ? '100%' : height,
        height: !landscape ? `min(${height * 5}px, 100%)` : height,
    } as CSSProperties

    return <div style={{ position: 'relative', height: '100%', width: '100%' }} >
        <div style={{ backgroundColor: Colours.black, height: height, minWidth: 300, display: 'flex', justifyContent: 'center' }} >
            {src && <img ref={image} src={src} width='100%' height={height + 10} style={{ objectFit: 'contain', ...rotateCss }} />}
        </div>
        <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    height: 70,
                    left: 0,
                    width: `100%`,
                    background: `linear-gradient(to top, #333F, #6660)`,
                }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', width: '100%' }}>
                    <IconButton onClick={_ => updateRotation()} color='primary'>
                        <Rotate90DegreesCw />
                    </IconButton>
                    {!fullscreen && <IconButton onClick={_ => showFullscreen()} color='primary'>
                        <Fullscreen />
                    </IconButton>}
                    {fullscreen && <IconButton onClick={_ => setImageState(old => ({ ...old, fullscreen: false }))} color='primary'>
                        <FullscreenExit />
                    </IconButton>}
                </div>
            </div>
        </div>
    </div >
}

type Props = {
    src?: string,
    height?: number
}

type VideoState = {
    src?: string,
    fullscreen: boolean,
    rotation: number,
}

const GlassImage = ({ src, height = 400 }: Props) => {
    const size = useSize()
    const [imageState, setImageState] = useState<VideoState>({
        fullscreen: false,
        rotation: 0,
        src
    })

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            console.log(event)
            if (event.key === 'Escape') setImageState(old => ({ ...old, fullscreen: false }))
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [])

    return <>
        {!imageState.fullscreen && <GlassImageFrame height={height} imageState={imageState} setImageState={setImageState} />}
        {imageState.fullscreen && <Modal
            onClose={() => setImageState(old => ({ ...old, fullscreen: false }))}
            open={imageState.fullscreen}
            style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <GlassImageFrame height={size.height} imageState={imageState} setImageState={setImageState} />
        </Modal>}
    </>
}

export default GlassImage