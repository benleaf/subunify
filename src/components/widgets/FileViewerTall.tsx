import { getFileSize } from "@/helpers/FileSize"
import { StoredFile } from "@/types/server/ProjectResult"
import { Download, Info, InfoRounded, PlayArrow, Refresh, Rotate90DegreesCw } from "@mui/icons-material"
import { ButtonBase, Chip, Fab, IconButton, Modal, Tooltip } from "@mui/material"
import ColorGlassCard from "../glassmorphism/ColorGlassCard"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useAuth } from "@/contexts/AuthContext"
import { FileQuality } from "@/types/FileQuality"
import { CSSProperties, useEffect, useState } from "react"
import { isError } from "@/api/isError"
import { CssSizes } from "@/constants/CssSizes"
import { Time } from "@/helpers/Time"
import { Colours } from "@/constants/Colours"
import { getExtension } from "@/helpers/FileProperties"
import moment from "moment"
import { VideoFiles } from "@/constants/VideoFiles"
import { AudioFiles } from "@/constants/AudioFiles"
import { useSize } from "@/hooks/useSize"

type Props = {
    thumbnail?: string,
    file: StoredFile,
    height?: number,
    containerWidth?: number
}

const DownloadPanel = ({ file }: { file: StoredFile }) => {
    if (file.created == null) return <GlassText size="moderate">Not Uploaded</GlassText>

    const extension = getExtension(file.name).toLocaleLowerCase()
    const videoFile = file.created != null && VideoFiles.includes(extension)

    const { authAction } = useAuth()
    const download = async (file: StoredFile, quality: FileQuality) => {
        const response = await authAction<{ url: string }>(`file-download/${file.id}/${quality}`, 'GET')

        if (isError(response)) {
            console.error(response)
            return
        }

        const { url } = response
        window.open(url, '_self');
    }

    if (file.location === 'DEEP' && file.available && moment(file.available).isBefore(moment()) && moment(file.available).add(48, 'hours').isAfter(moment())) {
        return <div style={{ display: 'flex', gap: CssSizes.tiny, flexWrap: 'wrap' }}>
            <ButtonBase onClick={() => download(file, 'RAW')}>
                <Chip icon={<Download color="primary" />} label={`AVAILABLE FOR ${moment(file.available).add(48, 'hours').diff(moment(), 'hours')} HOUR(S)`} />
            </ButtonBase>
        </div>
    } else if (file.location === 'DEEP' && moment(file.available).isAfter(moment())) {
        return <div style={{ display: 'flex', gap: CssSizes.tiny, flexWrap: 'wrap' }}>
            <ButtonBase onClick={() => download(file, 'RAW')}>
                <Chip icon={<Refresh color="primary" />} label={`AVAILABLE IN ${moment(file.available).diff(moment(), 'hours')} HOUR(S)`} />
            </ButtonBase>
        </div>
    } else if (file.location === 'DEEP') {
        return <div style={{ display: 'flex', gap: CssSizes.tiny, flexWrap: 'wrap' }}>
            <ButtonBase onClick={() => download(file, 'RAW')}>
                <Chip icon={<Refresh color="primary" />} label='RESTORE (12h)' />
            </ButtonBase>
        </div>
    } else if (file.proxyState == 'NA') {
        return <div style={{ display: 'flex', gap: CssSizes.tiny, flexWrap: 'wrap', alignItems: 'center' }}>
            <ButtonBase onClick={() => download(file, 'RAW')}>
                <Chip icon={<Download color="primary" />} label='Download' />
            </ButtonBase>
            {videoFile && <Chip icon={<Info color="info" />} label='Quality too low to process' />}
        </div>
    } else if (file.proxyState != 'COMPLETE') {
        return <div style={{ display: 'flex', gap: CssSizes.tiny, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip icon={<Download color="primary" />} label='Processing File, Refresh To Update...' />
        </div>
    }

    return <div style={{ display: 'flex', gap: CssSizes.tiny, flexWrap: 'wrap', alignItems: 'center' }}>
        <ButtonBase onClick={() => download(file, 'RAW')}>
            <Chip icon={<Download color="primary" />} label='RAW' />
        </ButtonBase>
        <ButtonBase onClick={() => download(file, 'HIGH')}>
            <Chip icon={<Download color="primary" />} label='4k' />
        </ButtonBase>
        <ButtonBase onClick={() => download(file, 'MEDIUM')}>
            <Chip icon={<Download color="primary" />} label='2k' />
        </ButtonBase>
        <ButtonBase onClick={() => download(file, 'LOW')}>
            <Chip icon={<Download color="primary" />} label='1080p' />
        </ButtonBase>
        <Tooltip title={<>
            <b>PROXIES</b>
            <p>4K: Apple ProRes 422 PROXY (3840x2160)</p>
            <p>2K: Apple ProRes 422 PROXY (2560x1440)</p>
            <p>1080p: AVC H.264 (1920x1080)</p>
        </>}>
            <IconButton>
                <InfoRounded />
            </IconButton>
        </Tooltip>
        <GlassText size="moderate"></GlassText>
    </div>
}

const FileViewerTall = ({ thumbnail, file }: Props) => {
    const { width } = useSize()
    const { authAction } = useAuth()
    const [fullscreen, setFullscreen] = useState(false)
    const oldRotate = +(localStorage.getItem('rotateMediaDegrees') ?? 0)
    const [rotation, setRotation] = useState(oldRotate)
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

    useEffect(() => {
        localStorage.setItem('rotateMediaDegrees', `${rotation}`)
    }, [rotation])

    const [preview, setPreview] = useState<string | null>(null)
    const extension = getExtension(file.name).toLocaleLowerCase()
    const videoFiles = file.created != null && VideoFiles.includes(extension)
    const transcoded = file.proxyState == 'COMPLETE'
    const isAudio = file.created != null && AudioFiles.includes(extension)
    const archiveIn = moment.duration(moment(file.created).add(30, 'days').diff(moment())).days()

    const showPreview = async (file: StoredFile) => {
        let response
        if (isAudio || (!transcoded && videoFiles)) response = await authAction<{ url: string }>(`file-download/${file.id}/RAW`, 'GET')
        if (transcoded) response = await authAction<{ url: string }>(`file-download/${file.id}/LOW`, 'GET')
        if (response && !isError(response)) setPreview(response.url)
    }

    useEffect(() => {
        showPreview(file)
    }, [])


    const getArchiveMessage = () => {
        if (!file.created) {
            return ''
        } else if (moment(file.created).add(30, 'days').isAfter(moment())) {
            return `Archive in ${archiveIn} day${archiveIn != 1 ? 's' : ''}`
        } else {
            return 'Archived'
        }
    }

    const Media = () => <>
        {videoFiles && preview && <div style={{ position: 'absolute', left: 0, top: -1, width: '100%' }} onClick={_ => setFullscreen(true)}>
            <video autoPlay style={{ ...rotateCss }}>
                <source src={preview} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>}
        {isAudio && preview && <div style={{ position: 'absolute', left: 0, top: -5, right: 0 }}>
            <GlassText size="small" color="primary" style={{ alignSelf: 'center' }}>Some audio clips may not be possible to preview</GlassText>
            <audio controls autoPlay style={{ width: '90%' }}>
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
    </>

    return <>
        <ColorGlassCard width='100%' paddingSize="tiny">
            {!fullscreen && <Media />}
            {(isAudio || videoFiles) && <div style={{ height: 230 }} />}
            <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Fab onClick={_ => setRotation(old => (old + 90) % 360)} size='small' >
                    <Rotate90DegreesCw fontSize="small" />
                </Fab>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <GlassText size="large">{file.name}</GlassText>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 300 }}>
                <GlassText size="moderate">{Time.formatDate(file.fileLastModified)}</GlassText>
                <GlassText size="moderate">{getFileSize(file.bytes)}</GlassText>
            </div>
            <GlassText size="small" color="primary">{getArchiveMessage()}</GlassText>
            <GlassSpace size="tiny" style={{ width: '100%', paddingTop: CssSizes.hairpin, overflow: 'hidden' }}>
                <DownloadPanel file={file} />
            </GlassSpace>
        </ColorGlassCard>
        {preview && <Modal
            open={fullscreen}
            onClose={_ => setFullscreen(false)}
            style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <video autoPlay style={{ objectFit: 'contain', ...rotateCss }}>
                <source src={preview} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </Modal>}
    </>
}

export default FileViewerTall