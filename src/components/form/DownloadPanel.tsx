import { isError } from "@/api/isError"
import { CssSizes } from "@/constants/CssSizes"
import { VideoFiles } from "@/constants/VideoFiles"
import { VideoCodecs } from "@/constants/VideoCodecs"
import { getExtension } from "@/helpers/FileProperties"
import { ProjectSettings, StoredFile } from "@/types/server/ProjectResult"
import { Download, Refresh, Info, InfoRounded } from "@mui/icons-material"
import { ButtonBase, Chip, Tooltip, IconButton, Divider } from "@mui/material"
import moment from "moment"
import GlassText from "../glassmorphism/GlassText"
import { useAction } from "@/contexts/actions/infrastructure/ActionContext"
import { ProxySettingTypes } from "@/types/server/ProxySettingTypes"
import { getFileSize } from "@/helpers/FileSize"
import { ProxySettingLabels } from "@/constants/ProxySettingLabels"

type Props = { file: StoredFile, projectSettings?: ProjectSettings }

export const DownloadPanel = ({ file, projectSettings }: Props) => {
    const { getFileProxyDownloadUrl } = useAction()
    if (file.created == null) return <GlassText size="moderate">Not Uploaded</GlassText>

    const extension = getExtension(file.name).toLocaleLowerCase()
    const videoFile = file.created != null && VideoFiles.includes(extension)
    const sizeSortedProxies = file.proxyFiles
        .sort((a, b) => +b.bytes - +a.bytes)
        .filter(proxy => proxy.proxyType != 'VIDEO_THUMBNAIL' && proxy.bytes)

    const download = async (file: StoredFile, quality: ProxySettingTypes) => {
        const response = await getFileProxyDownloadUrl(file, quality)

        if (!response || isError(response)) {
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
            <Tooltip enterTouchDelay={0} title={getFileSize(file.bytes)}>
                <ButtonBase onClick={() => download(file, 'RAW')}>
                    <Chip icon={<Download color="primary" />} label='Download' />
                </ButtonBase>
            </Tooltip>
            {videoFile && <Chip icon={<Info color="info" />} label='Quality too low to process' />}
        </div>
    } else if (file.proxyState != 'COMPLETE') {
        return <div style={{ display: 'flex', gap: CssSizes.tiny, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip icon={<Download color="primary" />} label='Processing File, Refresh To Update...' />
        </div>
    }

    return <div style={{ display: 'flex', gap: CssSizes.tiny, flexWrap: 'wrap', alignItems: 'center' }}>
        <Tooltip enterTouchDelay={0} title={getFileSize(file.bytes)}>
            <ButtonBase onClick={() => download(file, 'RAW')}>
                <Chip icon={<Download color="primary" />} label='RAW' />
            </ButtonBase>
        </Tooltip>
        {sizeSortedProxies.map(proxy => <Tooltip enterTouchDelay={0} title={<>
            <div>{VideoCodecs[proxy.transformation]}</div>
            <div>{getFileSize(+proxy.bytes)}</div>
        </>}>
            <ButtonBase onClick={() => download(file, proxy.proxyType)}>
                <Chip icon={<Download color="primary" />} label={ProxySettingLabels[proxy.proxyType]} />
            </ButtonBase>
        </Tooltip>)}
        {videoFile && <Tooltip enterTouchDelay={0} title={<>
            <b>PROXIES</b>
            <p>4K: {VideoCodecs[projectSettings?.VIDEO_CODEC_4K ?? 'H_264']} (3840x2160)</p>
            <p>2K: {VideoCodecs[projectSettings?.VIDEO_CODEC_2K ?? 'H_264']} (2560x1440)</p>
            <p>1080p: AVC H.264 (1920x1080)</p>
        </>}>
            <IconButton>
                <InfoRounded />
            </IconButton>
        </Tooltip>}
        <GlassText size="moderate"></GlassText>
    </div>
}