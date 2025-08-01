import { Colours } from "@/constants/Colours"
import { PlayArrow } from "@mui/icons-material"
import { ButtonBase, Modal } from "@mui/material"
import GlassText from "../glassmorphism/GlassText"
import { useSize } from "@/hooks/useSize"
import { useState, useEffect, CSSProperties } from "react"
import { StoredFile } from "@/types/server/ProjectResult"
import { isError } from "@/api/isError"
import { getExtension } from "@/helpers/FileProperties"
import { VideoFiles } from "@/constants/VideoFiles"
import { AudioFiles } from "@/constants/AudioFiles"
import { useAction } from "@/contexts/actions/infrastructure/ActionContext"

type Props = {
    file: StoredFile,
    thumbnail?: string,
    rotation: number,
    playing?: boolean
}

const MediaViewer = ({ file, thumbnail, rotation, playing = true }: Props) => {
    const { width } = useSize()
    const { getFileDownloadUrl } = useAction()
    const [fullscreen, setFullscreen] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)

    const extension = getExtension(file.name).toLocaleLowerCase()
    const videoFiles = file.created != null && VideoFiles.includes(extension)
    const transcoded = file.proxyState == 'COMPLETE'
    const isAudio = file.created != null && AudioFiles.includes(extension)

    useEffect(() => {
        localStorage.setItem('rotateMediaDegrees', `${rotation}`)
    }, [rotation])

    useEffect(() => {
        showPreview(file)
    }, [])

    const landscape = rotation == 0 || rotation == 180
    const mediaSize = fullscreen ? '80vh' : 'min(280px, 100%)'
    const offsets = width > 500 ? '38%' : (
        width > 400 ? 'calc(17% + 10px)' : 'calc(8% + 10px)'
    )

    const rotateCss = {
        transform: `${landscape || fullscreen ? '' : `translate(${offsets}, 60px)`} rotate(${rotation}deg)`,
        width: !landscape ? mediaSize : '100%',
        height: landscape ? mediaSize : '100%',
        objectFit: !fullscreen ? 'cover' : undefined
    } as CSSProperties

    const showPreview = async (file: StoredFile) => {
        let response
        if (isAudio || (!transcoded && videoFiles)) response = await getFileDownloadUrl(file)
        if (transcoded) response = await getFileDownloadUrl(file, 'VIDEO_CODEC_1080P')
        if (response && !isError(response)) setPreview(response.url)
    }

    return <>
        {!fullscreen && <>
            {videoFiles && preview && <div style={{ position: 'absolute', left: 0, top: -1, width: '100%' }} onClick={_ => setFullscreen(true)}>
                <video autoPlay={playing} style={{ ...rotateCss }}>
                    <source src={preview} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>}
            {isAudio && preview && <div style={{ position: 'absolute', left: 0, top: -5, right: 0 }}>
                <GlassText size="small" color="primary" style={{ alignSelf: 'center' }}>Some audio clips may not be possible to preview</GlassText>
                <audio controls autoPlay={playing} style={{ width: '90%' }}>
                    <source src={preview} />
                    Your browser does not support the audio element.
                </audio>
            </div>}
            {(isAudio || (videoFiles && thumbnail)) && !preview && <ButtonBase
                onClick={() => showPreview(file)}
                style={{ position: 'absolute', left: 0, top: -5, right: 0, backgroundColor: Colours.black, height: 305 }}
            >
                <div style={{ position: 'relative', width: '100%' }}>
                    <img src={thumbnail} width='100%' height={310} style={{ objectFit: 'cover' }} />
                    {!preview && <PlayArrow style={{ position: 'absolute', right: 0, bottom: 5, color: Colours.white }} />}
                </div>
            </ButtonBase >}
        </>}
        {(isAudio || videoFiles) && <div style={{ height: 230 }} />}
        {preview && <Modal
            open={fullscreen}
            onClick={_ => setFullscreen(false)}
            style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <video autoPlay={playing} style={{ objectFit: 'contain', ...rotateCss }}>
                <source src={preview} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </Modal>}
    </>
}

export default MediaViewer