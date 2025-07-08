import { getFileSize, getFileSizes } from "@/helpers/FileSize"
import { StoredFile } from "@/types/server/ProjectResult"
import { InfoRounded, PlayArrow } from "@mui/icons-material"
import { Stack, Divider, Tooltip, IconButton } from "@mui/material"
import ColorGlassCard from "../glassmorphism/ColorGlassCard"
import GlassText from "../glassmorphism/GlassText"
import BaseModal from "../modal/BaseModal"
import { useState } from "react"
import { useSize } from "@/hooks/useSize"
import { ScreenWidths } from "@/constants/ScreenWidths"
import { Time } from "@/helpers/Time"
import { Colours } from "@/constants/Colours"
import { getExtension } from "@/helpers/FileProperties"
import moment from "moment"
import { VideoFiles } from "@/constants/VideoFiles"
import { AudioFiles } from "@/constants/AudioFiles"
import FileViewerTall from "./FileViewerTall"

type Props = {
    thumbnail?: string,
    file: StoredFile,
    height?: number,
    containerWidth?: number
}

const FileViewer = ({ thumbnail, file, height = 60, containerWidth }: Props) => {
    const { width } = useSize()
    let displayWidth = containerWidth ?? width

    const [preview, setPreview] = useState(false)
    const extension = getExtension(file.name).toLocaleLowerCase()
    const videoFiles = file.created != null && VideoFiles.includes(extension)
    const isAudio = file.created != null && AudioFiles.includes(extension)
    const archiveIn = moment.duration(moment(file.created).add(30, 'days').diff(moment())).days()

    const getArchiveMessage = () => {
        if (!file.created) {
            return ''
        } else if (moment(file.created).add(30, 'days').isAfter(moment())) {
            return `Archive in ${archiveIn} day${archiveIn != 1 ? 's' : ''}`
        } else {
            return 'Archived'
        }
    }

    return <>
        <ColorGlassCard width='100%' paddingSize="tiny" flex={1} onClick={() => setPreview(true)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height }}>
                {(isAudio || (videoFiles && thumbnail)) && <>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: Colours.black }} >
                        <div style={{ position: 'relative', width: height * 2 + 21 }}>
                            {videoFiles && <img src={thumbnail} height={height + 20} style={{ objectFit: 'contain' }} />}
                        </div>
                        <PlayArrow style={{ position: 'absolute', right: 0, bottom: 5, color: Colours.white }} />
                    </div >
                    <div style={{ width: height * 2 + 30 }} />
                </>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
                    <Stack spacing={1}>
                        <div style={{ minWidth: height * 2 }}>
                            <GlassText size="moderate">{file.name}</GlassText>
                        </div>
                    </Stack>
                </div>
                {displayWidth > 700 && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: height * 2 }}>
                    {displayWidth > ScreenWidths.Mobile && <>
                        <Divider orientation="vertical" style={{ height: height / 2, marginInline: 10 }} />
                        <div>
                            <GlassText size="small">Last Modified</GlassText>
                            <GlassText size="moderate">{Time.formatDate(file.fileLastModified)}</GlassText>
                            <GlassText size="small" color="primary">{getArchiveMessage()}</GlassText>
                        </div>
                    </>}
                    <Divider orientation="vertical" style={{ height: height / 2, marginInline: 10 }} />
                    <Tooltip enterTouchDelay={0} title={<>
                        <p>File Size: {getFileSizes(file).rawSize}</p>
                        <p>Thumbnails/Proxies: {getFileSizes(file).proxy}</p>
                    </>}>
                        <div style={{ minWidth: height - 20 }}>
                            <GlassText size="small">Size</GlassText>
                            <GlassText size="moderate">{getFileSizes(file).total}</GlassText>
                        </div>
                    </Tooltip>
                </div>}
            </div>
        </ColorGlassCard>
        <BaseModal state={preview} close={() => setPreview(false)}>
            <FileViewerTall file={file} />
        </BaseModal>
        <BaseModal state={preview} close={() => setPreview(false)}>
            <FileViewerTall file={file} />
        </BaseModal>
    </>
}

export default FileViewer