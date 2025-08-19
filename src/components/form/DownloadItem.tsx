import { isError } from "@/api/isError"
import { VideoCodecs } from "@/constants/VideoCodecs"
import { StoredFile } from "@/types/server/ProjectResult"
import { Download, Timer, Sync } from "@mui/icons-material"
import { ButtonBase, Chip, Tooltip } from "@mui/material"
import moment from "moment"
import { useAction } from "@/contexts/actions/infrastructure/ActionContext"
import { ProxySettingTypes } from "@/types/server/ProxySettingTypes"
import { getFileSize } from "@/helpers/FileSize"
import { ProxySettingLabels } from "@/constants/ProxySettingLabels"
import { PreviewProxySettings } from "@/constants/PreviewProxySettings"

type Props = {
    file: StoredFile,
    lastFileRestore?: Date,
    bytes: number,
    proxyType?: ProxySettingTypes,
    transformation?: keyof typeof VideoCodecs,
}

export const DownloadItem = ({ file, lastFileRestore, proxyType, bytes, transformation }: Props) => {
    const { getFileDownloadUrl, restoreFile } = useAction()

    const download = async () => {
        const response = await getFileDownloadUrl(file, proxyType)

        if (!response || isError(response)) {
            console.error(response)
        } else {
            const { url } = response
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    const isArchived = file.location === 'DEEP' && !(proxyType && PreviewProxySettings.includes(proxyType))
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