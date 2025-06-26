import { isError } from "@/api/isError"
import { CssSizes } from "@/constants/CssSizes"
import { VideoFiles } from "@/constants/VideoFiles"
import { useAuth } from "@/contexts/AuthContext"
import { VideoCodecs } from "@/contexts/VideoCodecs"
import { getExtension } from "@/helpers/FileProperties"
import { FileQuality } from "@/types/FileQuality"
import { StoredFile } from "@/types/server/ProjectResult"
import { Download, Refresh, Info, InfoRounded } from "@mui/icons-material"
import { ButtonBase, Chip, Tooltip, IconButton } from "@mui/material"
import moment from "moment"
import GlassText from "../glassmorphism/GlassText"

type Props = { file: StoredFile, codec?: keyof typeof VideoCodecs }

export const DownloadPanel = ({ file, codec }: Props) => {
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
            <p>4K: {codec ? VideoCodecs[codec] : 'Apple ProRes 422 PROXY'} (3840x2160)</p>
            <p>2K: {codec ? VideoCodecs[codec] : 'Apple ProRes 422 PROXY'} (2560x1440)</p>
            <p>1080p: AVC H.264 (1920x1080)</p>
        </>}>
            <IconButton>
                <InfoRounded />
            </IconButton>
        </Tooltip>
        <GlassText size="moderate"></GlassText>
    </div>
}