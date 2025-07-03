import { isError } from '@/api/isError'
import { useAuth } from '@/contexts/AuthContext'
import { StoredFile } from '@/types/server/ProjectResult'
import { Forward10, Pause, PlayArrow, Replay10, Rotate90DegreesCw } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { CSSProperties, ElementRef, useEffect, useRef, useState } from 'react'
import GlassText from './GlassText'
import { Colours } from '@/constants/Colours'

type Props = {
    file?: StoredFile,
    height?: number
    placeholder?: string
}

const GlassVideo = ({ file, height = 400, placeholder }: Props) => {
    const { authAction } = useAuth()

    const video = useRef<HTMLVideoElement>(null)
    const progress = useRef<ElementRef<'div'>>(null)
    const [rotation, setRotation] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [src, setSrc] = useState<string>()
    const [time, setTime] = useState<number>(0)
    const [secondsSinceActive, setSecondsSinceActive] = useState<number>(0)

    const togglePlay = () => {
        if (playing) {
            video.current?.pause()
            setPlaying(false)
        } else {
            video.current?.play()
            setPlaying(true)
        }
    }

    const showPreview = async () => {
        if (!file) return
        const response = await authAction<{ url: string }>(`file-download/${file.id}/LOW`, 'GET')
        if (response && !isError(response)) {
            setSrc(response.url)
            setPlaying(true)
        }
    }

    useEffect(() => {
        const videoRef = video.current
        if (videoRef) {
            const handleTimeUpdate = () => {
                setTime(videoRef!.currentTime);
            }

            videoRef.addEventListener('timeupdate', handleTimeUpdate);
            const intervalId = setInterval(() => setSecondsSinceActive(old => old + 0.01), 10)

            return () => {
                videoRef!.removeEventListener('timeupdate', handleTimeUpdate)
                clearInterval(intervalId)
            };
        }
    }, [src]);

    const onProgressBarClicked = (clientX: number) => {
        const elementRect = progress.current!.getBoundingClientRect();
        const relativeClickX = clientX - elementRect.left;
        const newTime = video.current!.duration * (relativeClickX / elementRect.width)
        video.current!.currentTime = newTime
        setTime(newTime)
    }

    const changeTime = (change: number) => {
        video.current!.currentTime += change
        setTime(old => old += change)
    }

    const landscape = rotation == 0 || rotation == 180
    const rotateCss = {
        transform: `rotate(${rotation}deg)`,
        width: landscape ? '100%' : height,
        height: !landscape ? `min(${height * 5}px, 100%)` : height,
    } as CSSProperties

    return <div style={{ position: 'relative', height: '100%', width: '100%', cursor: secondsSinceActive < 3 ? 'auto' : 'none' }} onMouseMove={() => setSecondsSinceActive(0)} onClick={() => setSecondsSinceActive(0)}>
        <div style={{ backgroundColor: Colours.black, height: height, minWidth: 300, display: 'flex', justifyContent: 'center' }} onClick={_ => togglePlay()}>
            {!src && placeholder && <div style={{ position: 'relative', height: '100%' }} onClick={showPreview}>
                <img src={placeholder} height={height + 10} style={{ objectFit: 'contain', ...rotateCss }} />
            </div>}
            {src && <video ref={video} autoPlay={true} width='100%' height={height + 10} style={{ objectFit: 'contain', ...rotateCss }}>
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>}
        </div>
        <div style={{ position: 'absolute', bottom: 0, width: '100%', opacity: (4 / secondsSinceActive) - 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div>
                    {playing && <IconButton onClick={_ => changeTime(-10)} color='primary'>
                        <Replay10 />
                    </IconButton>}
                    {playing && <IconButton onClick={_ => togglePlay()} color='primary'>
                        <Pause />
                    </IconButton>}
                    {!playing && <IconButton onClick={_ => togglePlay()} color='primary'>
                        <PlayArrow />
                    </IconButton>}
                    {playing && <IconButton onClick={_ => changeTime(10)} color='primary'>
                        <Forward10 />
                    </IconButton>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <GlassText size='moderate' color='primary'>{new Date((time ?? 0) * 1000).toISOString().substring(11, 19)}</GlassText>
                    <IconButton onClick={_ => setRotation(old => (old + 90) % 360)} color='primary'>
                        <Rotate90DegreesCw />
                    </IconButton>
                </div>
            </div>
            <div
                ref={progress}
                style={{ height: 15, width: `100%`, position: 'relative', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                onClick={e => onProgressBarClicked(e.clientX)}
            >
                <div
                    style={{ width: `calc(100% - 10px)` }}
                    onClick={e => onProgressBarClicked(e.clientX)}
                >
                    {video.current && <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            width: 5,
                            height: 18,
                            left: `calc(${100 * time / video.current!.duration}% - 2.5px)`,
                            backgroundColor: Colours.primary,
                            background: `linear-gradient(to top, ${Colours.primary}, #f005)`,
                            borderRadius: '5px 5px 0 0',
                        }} />}
                    {video.current && <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            height: 15,
                            left: 0,
                            width: `${100 * time / video.current!.duration}%`,
                            background: `linear-gradient(to top, ${Colours.primary}, #0000)`,
                        }} />}
                </div>
            </div>
        </div>
    </div >
}

export default GlassVideo