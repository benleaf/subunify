import { CssSizes } from "@/constants/CssSizes"
import { VideoFiles } from "@/constants/VideoFiles"
import { VideoCodecs } from "@/constants/VideoCodecs"
import { getExtension } from "@/helpers/FileProperties"
import { ProjectSettings, StoredFile } from "@/types/server/ProjectResult"
import { Info, InfoRounded } from "@mui/icons-material"
import { Chip, Tooltip, IconButton } from "@mui/material"
import GlassText from "../glassmorphism/GlassText"
import { DownloadItem } from "./DownloadItem"

type Props = { file: StoredFile, projectSettings?: ProjectSettings }

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
        {videoFile && file.proxyState == 'NA' && <Chip icon={<Info color="info" />} label='Exceeded Processing Limit' />}
    </div>
}