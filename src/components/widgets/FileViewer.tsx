import { getFileSize } from "@/helpers/FileSize"
import { StoredFile } from "@/types/server/ProjectResult"
import { Download, FilePresent, Folder, PlayArrow, Refresh } from "@mui/icons-material"
import { Stack, ButtonBase, Chip, Divider, Badge } from "@mui/material"
import ColorGlassCard from "../glassmorphism/ColorGlassCard"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import BaseModal from "../modal/BaseModal"
import { useAuth } from "@/contexts/AuthContext"
import { FileQuality } from "@/types/FileQuality"
import { useState } from "react"
import { isError } from "@/api/isError"
import { useSize } from "@/hooks/useSize"
import { CssSizes } from "@/constants/CssSizes"
import { ScreenWidths } from "@/constants/ScreenWidths"
import { Time } from "@/helpers/Time"
import { Colours } from "@/constants/Colours"
import { getExtension } from "@/helpers/FileProperties"
import moment from "moment"
import { TranscodedFiles } from "@/constants/TranscodedFiles"
import { AudioFiles } from "@/constants/AudioFiles"

type Props = {
    thumbnail?: string,
    file: StoredFile
}

const DownloadPanel = ({ file }: { file: StoredFile }) => {
    const transcoded = TranscodedFiles.includes(getExtension(file.name))
    if (file.created == null) return <GlassText size="moderate">Not Uploaded</GlassText>

    const { authAction } = useAuth()
    const download = async (file: StoredFile, quality: FileQuality) => {
        const response = await authAction<{ url: string }>(`storage-file/download/${file.id}/${quality}`, 'GET')

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
    } else if (!transcoded) {
        return <div style={{ display: 'flex', gap: CssSizes.tiny, flexWrap: 'wrap', alignItems: 'center' }}>
            <ButtonBase onClick={() => download(file, 'RAW')}>
                <Chip icon={<Download color="primary" />} label='Download' />
            </ButtonBase>
        </div>
    }

    return <div style={{ display: 'flex', gap: CssSizes.tiny, flexWrap: 'wrap', alignItems: 'center' }}>
        <ButtonBase onClick={() => download(file, 'RAW')}>
            <Chip icon={<Download color="primary" />} label='RAW' />
        </ButtonBase>
        <ButtonBase onClick={() => download(file, 'HIGH')}>
            <Chip icon={<Download color="primary" />} label='High' />
        </ButtonBase>
        <ButtonBase onClick={() => download(file, 'MEDIUM')}>
            <Chip icon={<Download color="primary" />} label='Medium' />
        </ButtonBase>
        <ButtonBase onClick={() => download(file, 'LOW')}>
            <Chip icon={<Download color="primary" />} label='Low' />
        </ButtonBase>
    </div>
}

const FileViewer = ({ thumbnail, file }: Props) => {
    const { authAction } = useAuth()
    const { width } = useSize()
    const [preview, setPreview] = useState<string | null>(null)
    const extension = getExtension(file.name).toLocaleLowerCase()
    const transcoded = file.created != null && TranscodedFiles.includes(extension)
    const isAudio = file.created != null && AudioFiles.includes(extension)

    const showPreview = async (file: StoredFile) => {
        let response
        if (isAudio) response = await authAction<{ url: string }>(`storage-file/download/${file.id}/RAW`, 'GET')
        if (transcoded) response = await authAction<{ url: string }>(`storage-file/download/${file.id}/LOW`, 'GET')
        if (response && !isError(response)) setPreview(response.url)
    }

    const archiveMessage = moment(file.created).add(30, 'days').isAfter(moment()) ?
        `Archive in ${moment.duration(moment().diff(moment(file.created).add(30, 'days'))).humanize()}` :
        'Archived'

    return <>
        {width > ScreenWidths.Mobile && <>
            <ColorGlassCard width='100%' paddingSize="tiny" flex={1}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 100 }}>
                    {(isAudio || (transcoded && thumbnail)) && <>
                        <ButtonBase
                            onClick={() => showPreview(file)}
                            style={{ position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: Colours.black }}
                        >
                            <div style={{ position: 'relative', width: 213 }}>
                                {transcoded && <img src={thumbnail} height={120} style={{ objectFit: 'contain' }} />}
                            </div>
                            <PlayArrow style={{ position: 'absolute', right: 0, bottom: 5, color: Colours.white }} />
                        </ButtonBase >
                        <div style={{ width: 220 }} />
                    </>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
                        <Stack spacing={1}>
                            <div style={{ minWidth: 200 }}>
                                <GlassText size="moderate">{file.name}</GlassText>
                            </div>
                            <DownloadPanel file={file} />
                        </Stack>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 200 }}>
                        <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                        <div>
                            <GlassText size="small">File Created</GlassText>
                            <GlassText size="moderate">{Time.formatDate(file.fileLastModified)}</GlassText>
                            <GlassText size="small" color="primary">{archiveMessage}</GlassText>
                        </div>
                        <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                        <div style={{ minWidth: 80 }}>
                            <GlassText size="small">RAW Size</GlassText>
                            <GlassText size="moderate">{getFileSize(file.bytes)}</GlassText>
                        </div>
                    </div>
                </div>
            </ColorGlassCard>
        </>}
        {width <= ScreenWidths.Mobile && <ColorGlassCard width='100%' paddingSize="tiny">
            {transcoded && preview && <div style={{ position: 'absolute', left: 0, top: -5, right: 0 }}>
                <video controls autoPlay width='100%' height={200} style={{ objectFit: 'contain' }} >
                    <source src={preview} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>}
            {(isAudio || (transcoded && thumbnail)) && !preview && <ButtonBase
                onClick={() => showPreview(file)}
                style={{ position: 'absolute', left: 0, top: -5, right: 0, backgroundColor: Colours.black }}
            >
                <div style={{ position: 'relative', width: '100%' }}>
                    <img src={thumbnail} width='100%' height={200} style={{ objectFit: 'cover' }} />
                    {!preview && <PlayArrow style={{ position: 'absolute', right: 0, bottom: 5, color: Colours.white }} />}
                </div>
            </ButtonBase >}
            {(isAudio || transcoded) && <div style={{ height: 200 }} />}
            <GlassText size="large">{file.name}</GlassText>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 200 }}>
                <GlassText size="moderate">{Time.formatDate(file.fileLastModified)}</GlassText>
                <GlassText size="moderate">{getFileSize(file.bytes)}</GlassText>
            </div>
            <GlassText size="small" color="primary">{archiveMessage}</GlassText>
            <GlassSpace size="tiny" style={{ width: '100%', paddingTop: CssSizes.hairpin, overflow: 'hidden' }}>
                <DownloadPanel file={file} />
            </GlassSpace>
        </ColorGlassCard>}
        {(isAudio || width > ScreenWidths.Mobile) && <BaseModal state={preview ? "open" : 'closed'} close={() => setPreview(null)}>
            {preview && transcoded && <video controls autoPlay>
                <source src={preview} type="video/mp4" />
                Your browser does not support the video tag.
            </video>}
            {preview && isAudio && <>
                <GlassText size="small" color="primary" style={{ alignSelf: 'center' }}>Some audio clips may not be possible to preview</GlassText>
                <audio controls autoPlay style={{ width: '90%' }}>
                    <source src={preview} />
                    Your browser does not support the audio element.
                </audio>
            </>}
        </BaseModal>}
    </>
}

export default FileViewer