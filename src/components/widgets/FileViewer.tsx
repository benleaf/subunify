import { getFileSize } from "@/helpers/FileSize"
import { StoredFile } from "@/types/server/ProjectResult"
import { Download, PlayArrow } from "@mui/icons-material"
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

type Props = {
    thumbnail?: string,
    file: StoredFile
}

const DownloadPanel = ({ file }: { file: StoredFile }) => {
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

    return <div style={{ display: 'flex', gap: CssSizes.tiny, flexWrap: 'wrap' }}>
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
    const perviewable = file.created != null && (getExtension(file.name) == 'mp4' || getExtension(file.name) == 'mov')

    const showPreview = async (file: StoredFile) => {
        if (!perviewable) return;
        const response = await authAction<{ url: string }>(`storage-file/download/${file.id}/LOW`, 'GET')
        if (!isError(response)) setPreview(response.url)
    }

    return <>
        {width > ScreenWidths.Mobile && <>
            <ColorGlassCard width='100%' paddingSize="tiny" flex={1}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 100 }}>
                    {thumbnail && <ButtonBase onClick={() => showPreview(file)} style={{ position: 'absolute', left: 0, top: 0, bottom: 0 }}>
                        <div style={{ position: 'relative' }}>
                            <img src={thumbnail} height={120} style={{ objectFit: 'contain' }} />
                            {perviewable && <PlayArrow style={{ position: 'absolute', right: 0, bottom: 5, color: Colours.white }} />}
                        </div>
                    </ButtonBase >}
                    <div style={{ width: 250 }} />
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
                        </div>
                        <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                        <div>
                            <GlassText size="small">RAW Size</GlassText>
                            <GlassText size="moderate">{getFileSize(file.bytes)}</GlassText>
                        </div>
                    </div>
                </div>
            </ColorGlassCard>
            <BaseModal state={preview ? "open" : 'closed'} close={() => setPreview(null)}>
                {preview && <video controls autoPlay>
                    <source src={preview} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>}
            </BaseModal>
        </>}
        {width <= ScreenWidths.Mobile && <ColorGlassCard width='100%' paddingSize="tiny">
            {perviewable && preview && <div style={{ position: 'absolute', left: 0, top: -5, right: 0 }}>
                <video controls autoPlay width='100%' height={200} style={{ objectFit: 'contain' }} >
                    <source src={preview} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>}
            {thumbnail && !preview && <ButtonBase onClick={() => showPreview(file)} style={{ position: 'absolute', left: 0, top: -5, right: 0 }}>
                <div style={{ position: 'relative', width: '100%' }}>
                    <img src={thumbnail} width='100%' height={200} style={{ objectFit: 'cover' }} />
                    {!preview && <PlayArrow style={{ position: 'absolute', right: 0, bottom: 5, color: Colours.white }} />}
                </div>
            </ButtonBase >}
            <div style={{ height: 200 }} />
            <GlassText size="large">{file.name}</GlassText>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 200 }}>
                <GlassText size="moderate">{Time.formatDate(file.fileLastModified)}</GlassText>
                <GlassText size="moderate">{getFileSize(file.bytes)}</GlassText>
            </div>
            <GlassSpace size="tiny" style={{ width: '100%', paddingTop: CssSizes.hairpin, overflow: 'hidden' }}>
                <DownloadPanel file={file} />
            </GlassSpace>
        </ColorGlassCard>}
    </>
}

export default FileViewer