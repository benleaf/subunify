import { isError } from "@/api/isError"
import { CssSizes } from "@/constants/CssSizes"
import { VideoFiles } from "@/constants/VideoFiles"
import { VideoCodecs } from "@/constants/VideoCodecs"
import { getExtension } from "@/helpers/FileProperties"
import { ProjectSettings, StoredFile } from "@/types/server/ProjectResult"
import { Download, Info, InfoRounded, Timer, Sync } from "@mui/icons-material"
import { ButtonBase, Chip, Tooltip, IconButton } from "@mui/material"
import moment from "moment"
import GlassText from "../glassmorphism/GlassText"
import { useAction } from "@/contexts/actions/infrastructure/ActionContext"
import { ProxySettingTypes } from "@/types/server/ProxySettingTypes"
import { getFileSize } from "@/helpers/FileSize"
import { ProxySettingLabels } from "@/constants/ProxySettingLabels"

type Props = { file: StoredFile, projectSettings?: ProjectSettings }
type DownloadItemProps = {
    file: StoredFile,
    lastFileRestore?: Date,
    bytes: number,
    proxyType?: ProxySettingTypes,
    transformation?: keyof typeof VideoCodecs,
}

const DownloadItem = ({ file, lastFileRestore, proxyType, bytes, transformation }: DownloadItemProps) => {
    const { getFileDownloadUrl, restoreFile } = useAction()

    const download = async () => {
        const response = await getFileDownloadUrl(file, proxyType)

        if (!response || isError(response)) {
            console.error(response)
            return
        }

        const { url } = response
        window.open(url, '_self');
    }

    const isArchived = file.location === 'DEEP'
    const isRestoring = isArchived && moment(lastFileRestore).add(48, 'hour').isAfter(moment())
    const isRestored = isArchived && moment(lastFileRestore).add(48, 'hour').isBefore(moment()) && moment(lastFileRestore).add(9, 'days').isAfter(moment())

    const icon = (
        isRestoring && <Timer color="primary" /> ||
        isArchived && !isRestored && <Sync color="primary" /> ||
        <Download color="primary" />
    )

    const action = (
        isArchived && !isRestoring && !isRestored && (() => restoreFile(file, proxyType)) ||
        isArchived && isRestoring && console.log ||
        download
    )

    const postFix = (
        isArchived && !isRestoring && !isRestored && '48h' ||
        isRestoring && `${moment(lastFileRestore).add(48, 'hours').diff(moment(), 'hours')}h` ||
        isRestored && `${moment(lastFileRestore).add(9, 'days').diff(moment(), 'days')} days`
    )

    const fileDetails = proxyType && transformation ? `${ProxySettingLabels[proxyType]} ${VideoCodecs[transformation] ?? ''}` : 'RAW'
    const fileType = proxyType && transformation ? ProxySettingLabels[proxyType] : 'RAW'
    const fileLabel = `${fileType}${postFix ? ` (${postFix})` : ''}`

    const message = (
        isRestoring && `RESTORING, AVAILABLE IN ${moment(lastFileRestore).add(48, 'hours').diff(moment(), 'hours')} HOUR(S)` ||
        isRestored && `AVAILABLE FOR ${moment(lastFileRestore).add(9, 'days').diff(moment(), 'days')} DAY(S)` ||
        !isArchived && `Download ${fileDetails}` ||
        `Restore ${fileDetails} (48h)`
    )

    return <Tooltip enterTouchDelay={0} title={<>
        <div>{message}</div>
        <div>{getFileSize(bytes)}</div>
    </>}>
        <ButtonBase onClick={() => action()}>
            <Chip icon={icon} label={fileLabel} />
        </ButtonBase>
    </Tooltip>
}

export const DownloadPanel = ({ file, projectSettings }: Props) => {
    if (file.created == null) return <GlassText size="moderate">Not Uploaded</GlassText>

    const extension = getExtension(file.name).toLocaleLowerCase()
    const videoFile = file.created != null && VideoFiles.includes(extension)
    const sizeSortedProxies = file.proxyFiles
        .sort((a, b) => +b.bytes - +a.bytes)
        .filter(proxy => proxy.proxyType != 'VIDEO_THUMBNAIL' && proxy.bytes)

    return <div style={{ display: 'flex', gap: CssSizes.tiny, flexWrap: 'wrap', alignItems: 'center' }}>
        <DownloadItem file={file} lastFileRestore={file.lastFileRestore} bytes={file.bytes} />
        {sizeSortedProxies.map(proxy => <DownloadItem
            file={file}
            lastFileRestore={proxy.lastFileRestore}
            bytes={+proxy.bytes}
            proxyType={proxy.proxyType}
            transformation={proxy.transformation}
        />)}
        {videoFile && file.proxyState != 'NA' && <Tooltip enterTouchDelay={0} title={<>
            <b>PROXIES</b>
            <p>4K: {VideoCodecs[projectSettings?.VIDEO_CODEC_4K ?? 'H_264']} (3840x2160)</p>
            <p>2K: {VideoCodecs[projectSettings?.VIDEO_CODEC_2K ?? 'H_264']} (2560x1440)</p>
            <p>1080p: AVC H.264 (1920x1080)</p>
        </>}>
            <IconButton>
                <InfoRounded />
            </IconButton>
        </Tooltip>}
        {videoFile && file.proxyState == 'NA' && <Chip icon={<Info color="info" />} label='Quality too low to process' />}
    </div>
}