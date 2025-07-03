import { getFileSize } from "@/helpers/FileSize"
import { StoredFile } from "@/types/server/ProjectResult"
import { PlayArrow, Rotate90DegreesCw, Share } from "@mui/icons-material"
import { ButtonBase, Fab, Modal } from "@mui/material"
import ColorGlassCard from "../glassmorphism/ColorGlassCard"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useAuth } from "@/contexts/AuthContext"
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
import { useDashboard } from "@/contexts/DashboardContext"
import { DownloadPanel } from "../form/DownloadPanel"
import ShareFile from "../modal/ShareFile"
import MediaViewer from "./MediaViewer"

type Props = {
    thumbnail?: string,
    file: StoredFile,
    height?: number,
    containerWidth?: number
}

const FileViewerTall = ({ thumbnail, file }: Props) => {
    const { properties } = useDashboard()
    const oldRotate = +(localStorage.getItem('rotateMediaDegrees') ?? 0)
    const [rotation, setRotation] = useState(oldRotate)


    const [share, setShare] = useState(false)
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
        <ColorGlassCard width='100%' paddingSize="tiny">
            {!share && <MediaViewer file={file} thumbnail={thumbnail} rotation={rotation} />}
            <div style={{ display: 'flex', justifyContent: 'end', gap: CssSizes.tiny }}>
                <Fab onClick={_ => setRotation(old => (old + 90) % 360)} size='small' >
                    <Rotate90DegreesCw fontSize="small" />
                </Fab>
                <Fab onClick={_ => setShare(true)} size='small' >
                    <Share fontSize="small" />
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
                <DownloadPanel file={file} codec={properties.selectedProject?.projectSettings?.videoCodec} />
            </GlassSpace>
        </ColorGlassCard>
        <ShareFile file={file} state={share} close={() => setShare(false)} />
    </>
}

export default FileViewerTall