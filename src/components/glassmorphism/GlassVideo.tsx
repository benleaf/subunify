import { isError } from '@/api/isError'
import { useAuth } from '@/contexts/AuthContext'
import { StoredFile } from '@/types/server/ProjectResult'
import { Forward10, Fullscreen, FullscreenExit, Pause, PlayArrow, Replay10, Rotate90DegreesCw } from '@mui/icons-material'
import { IconButton, Modal } from '@mui/material'
import { CSSProperties, ElementRef, useEffect, useRef, useState } from 'react'
import GlassText from './GlassText'
import { Colours } from '@/constants/Colours'
import { useSize } from '@/hooks/useSize'
import { getExtension } from '@/helpers/FileProperties'
import { VideoFiles } from '@/constants/VideoFiles'
import { useAction } from '@/contexts/actions/infrastructure/ActionContext'


type GlassVideoFrameProps = {
    file?: StoredFile,
    height?: number
    placeholder?: string
    videoState: VideoState,
    setVideoState: (value: React.SetStateAction<VideoState>) => void
}

const GlassVideoFrame = ({ file, height = 400, placeholder, videoState, setVideoState }: GlassVideoFrameProps) => {
    const { getFileDownloadUrl } = useAction()
    const { rotation, fullscreen, playing, secondsSinceActive, time, src } = videoState
    const video = useRef<HTMLVideoElement>(null)
    const progress = useRef<ElementRef<'div'>>(null)
    const unprocessed = file && !file.proxyFiles.length

    useEffect(() => {
        if (video.current) {
            video.current.currentTime = time
        }
    }, [video])

    useEffect(() => {
        if (file) {
            const rotation = localStorage.getItem(`rotate_${file.id}`)
            setVideoState(old => ({ ...old, rotation: +(rotation ?? '0') }))
        }
    }, [file])

    useEffect(() => {
        updatePlaying()
    }, [videoState.playing])

    const updatePlaying = async () => {
        if (!src) await showPreview()
        if (videoState.playing) {
            video.current?.play()
        } else {
            video.current?.pause()
        }
    }

    const updateRotation = () => {
        const newRotation = (rotation + 90) % 360
        setVideoState(old => ({ ...old, rotation: newRotation }))
        if (file) localStorage.setItem(`rotate_${file.id}`, `${newRotation}`)
    }

    const showFullscreen = async () => {
        if (!src) await showPreview()
        setVideoState(old => ({ ...old, fullscreen: true }))
    }

    const showPreview = async () => {
        const lowResProxy = file?.proxyFiles.find(proxy => proxy.proxyType == 'VIDEO_CODEC_1080P')
        if (!lowResProxy && !file) {
            return
        } else if (file) {
            const response = await getFileDownloadUrl(file, lowResProxy?.proxyType)
            if (response && !isError(response)) {
                setVideoState(old => ({ ...old, src: response.url }))
            }
        }
    }

    useEffect(() => {
        const videoRef = video.current
        if (videoRef) {
            const handleTimeUpdate = () => {
                setVideoState(old => ({ ...old, time: videoRef!.currentTime }))
            }

            videoRef.addEventListener('timeupdate', handleTimeUpdate);
            const intervalId = setInterval(
                () => setVideoState(old => ({ ...old, secondsSinceActive: old.secondsSinceActive + 0.01 })),
                10
            )

            return () => {
                videoRef!.removeEventListener('timeupdate', handleTimeUpdate)
                clearInterval(intervalId)
            };
        }
    }, [src]);

    const onProgressBarClicked = async (clientX: number) => {
        if (!video.current) return await showPreview()
        const elementRect = progress.current!.getBoundingClientRect();
        const relativeClickX = clientX - elementRect.left;
        const newTime = video.current!.duration * (relativeClickX / elementRect.width)
        video.current.currentTime = newTime
        setVideoState(old => ({ ...old, time: newTime }))
    }

    const changeTime = async (change: number) => {
        if (!video.current) await showPreview()
        video.current!.currentTime += change
        setVideoState(old => ({ ...old, time: old.time += change, secondsSinceActive: 0 }))
    }

    const landscape = rotation == 0 || rotation == 180
    const rotateCss = {
        transform: `rotate(${rotation}deg)`,
        width: landscape ? '100%' : height,
        height: !landscape ? `min(${height * 5}px, 100%)` : height,
    } as CSSProperties

    return <div
        style={{ position: 'relative', height: '100%', width: '100%', cursor: secondsSinceActive < 3 ? 'auto' : 'none' }}
        onMouseMove={() => setVideoState(old => ({ ...old, secondsSinceActive: 0 }))}
        onMouseLeave={() => setVideoState(old => ({ ...old, secondsSinceActive: 100 }))}
    >
        <div
            style={{ backgroundColor: Colours.black, height: height, minWidth: 300, display: 'flex', justifyContent: 'center' }}
            onClick={_ => setVideoState(old => ({ ...old, playing: !old.playing }))}
        >
            {!src && placeholder && !unprocessed && <div style={{ position: 'relative', height: '100%' }} onClick={showPreview}>
                <img src={placeholder} height={height + 10} style={{ objectFit: 'contain', ...rotateCss }} />
            </div>}
            {src && <video ref={video} autoPlay={playing} preload="true" width='100%' height={height + 10} style={{ objectFit: 'contain', ...rotateCss }}>
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>}
        </div>
        <div style={{ position: 'absolute', bottom: 0, width: '100%', opacity: (5 / (secondsSinceActive + 1)) - 1 }}>
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
                <div>
                    <IconButton onClick={_ => changeTime(-10)} color='primary'>
                        <Replay10 />
                    </IconButton>
                    {playing && <IconButton onClick={_ => setVideoState(old => ({ ...old, playing: false }))} color='primary'>
                        <Pause />
                    </IconButton>}
                    {!playing && <IconButton onClick={_ => setVideoState(old => ({ ...old, playing: true }))} color='primary'>
                        <PlayArrow />
                    </IconButton>}
                    <IconButton onClick={_ => changeTime(10)} color='primary'>
                        <Forward10 />
                    </IconButton>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <GlassText style={{ zIndex: 100 }} size='moderate' color='primary'><b>{new Date((time ?? 0) * 1000).toISOString().substring(11, 19)}</b></GlassText>
                    <IconButton onClick={_ => updateRotation()} color='primary'>
                        <Rotate90DegreesCw />
                    </IconButton>
                    {!fullscreen && <IconButton onClick={_ => showFullscreen()} color='primary'>
                        <Fullscreen />
                    </IconButton>}
                    {fullscreen && <IconButton onClick={_ => setVideoState(old => ({ ...old, fullscreen: false }))} color='primary'>
                        <FullscreenExit />
                    </IconButton>}
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
                            left: `calc(${Math.min(100, 100 * time / video.current!.duration)}% - 2.5px)`,
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
                            width: `${Math.min(100, 100 * time / video.current!.duration)}%`,
                            background: `linear-gradient(to top, ${Colours.primary}, #0000)`,
                        }} />}
                </div>
            </div>
        </div>
    </div >
}

type Props = {
    file?: StoredFile,
    height?: number
    placeholder?: string
}

type VideoState = {
    src?: string,
    fullscreen: boolean,
    playing: boolean,
    rotation: number,
    time: number,
    secondsSinceActive: number
}

const GlassVideo = ({ file, height = 400, placeholder }: Props) => {
    const size = useSize()
    const [videoState, setVideoState] = useState<VideoState>({
        fullscreen: false,
        playing: false,
        rotation: 0,
        time: 0,
        secondsSinceActive: 0,
    })

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            console.log(event)
            if (event.key === 'Escape') setVideoState(old => ({ ...old, fullscreen: false }))
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [])

    return <>
        {!videoState.fullscreen && <GlassVideoFrame file={file} height={height} placeholder={placeholder} videoState={videoState} setVideoState={setVideoState} />}
        <Modal
            onClose={() => setVideoState(old => ({ ...old, fullscreen: false }))}
            open={videoState.fullscreen}
            style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <GlassVideoFrame file={file} height={size.height} placeholder={placeholder} videoState={videoState} setVideoState={setVideoState} />
        </Modal>
    </>
}

export default GlassVideo