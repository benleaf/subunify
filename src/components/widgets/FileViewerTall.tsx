import { getFileSizes } from "@/helpers/FileSize"
import { StoredFile } from "@/types/server/ProjectResult"
import { Share } from "@mui/icons-material"
import { Fab } from "@mui/material"
import ColorGlassCard from "../glassmorphism/ColorGlassCard"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useState } from "react"
import { CssSizes } from "@/constants/CssSizes"
import { Time } from "@/helpers/Time"
import moment from "moment"
import { useDashboard } from "@/contexts/DashboardContext"
import { DownloadPanel } from "../form/DownloadPanel"
import ShareFile from "../modal/ShareFile"
import MediaContent from "./MediaContent"

type Props = {
    thumbnail?: string,
    file: StoredFile,
    height?: number,
    containerWidth?: number
}

const FileViewerTall = ({ file }: Props) => {
    const { properties } = useDashboard()

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
            {!share && <div style={{ position: 'absolute', left: 0, top: -1, width: '100%' }}>
                <MediaContent file={file} height={270} />
            </div>}
            <div style={{ height: 260 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: CssSizes.tiny, gap: CssSizes.tiny }}>
                <GlassText size="large">{file.name}</GlassText>
                <Fab onClick={_ => setShare(true)} size='small' >
                    <Share fontSize="small" />
                </Fab>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 300 }}>
                <GlassText size="moderate">{Time.formatDate(file.fileLastModified)}</GlassText>
                <GlassText size="moderate">{getFileSizes(file).total}</GlassText>
            </div>
            <GlassText size="small" color="primary">{getArchiveMessage()}</GlassText>
            <GlassSpace size="tiny" style={{ width: '100%', paddingTop: CssSizes.hairpin, overflow: 'hidden' }}>
                <DownloadPanel file={file} projectSettings={properties.selectedProject?.projectSettings} />
            </GlassSpace>
        </ColorGlassCard>
        <ShareFile file={file} state={share} close={() => setShare(false)} />
    </>
}

export default FileViewerTall