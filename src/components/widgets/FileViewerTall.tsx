import { getFileSizes } from "@/helpers/FileSize"
import { StoredFile } from "@/types/server/ProjectResult"
import { AttachFile, ExpandMore, Share, Storage } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, Divider, Fab, Stack } from "@mui/material"
import ColorGlassCard from "../glassmorphism/ColorGlassCard"
import GlassText from "../glassmorphism/GlassText"
import { useState } from "react"
import { CssSizes } from "@/constants/CssSizes"
import { Time } from "@/helpers/Time"
import moment from "moment"
import { useDashboard } from "@/contexts/DashboardContext"
import { DownloadPanel } from "../form/DownloadPanel"
import ShareFile from "../modal/ShareFile"
import MediaContent from "./MediaContent"
import AttachAFile from "../modal/AttachAFile"

type Props = {
    thumbnail?: string,
    file: StoredFile,
    height?: number,
    containerWidth?: number
}

const FileViewerTall = ({ file }: Props) => {
    const { properties } = useDashboard()
    const [attach, setAttach] = useState(false)
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

    const allFiles = properties.selectedProject?.files ?? []
    const attachedFiles = file.attachedFiles
        .map(currentFile => allFiles.find(projectFile => projectFile.id == currentFile.attachedFile.id))
        .filter(file => file !== undefined)

    return <>
        <ColorGlassCard width='100%' paddingSize="moderate">
            {!share && <div style={{ position: 'absolute', left: 0, top: -1, width: '100%' }}>
                <MediaContent file={file} height={270} />
            </div>}
            <div style={{ height: 260 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: CssSizes.tiny }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: CssSizes.tiny }}>
                    <div>
                        <GlassText size="moderate">{file.name}</GlassText>
                        <GlassText color="primary" size="small">{Time.formatDate(file.fileLastModified)}</GlassText>
                        <div style={{ display: 'flex', gap: CssSizes.tiny, padding: CssSizes.tiny }} >
                            <Storage fontSize="small" />
                            <GlassText size="small" color="darkGrey">Backup Copies <b>2</b> USA (Ohio)</GlassText>
                        </div>
                    </div>
                    <DownloadPanel file={file} projectSettings={properties.selectedProject?.projectSettings} />
                </div>
                <div style={{ display: 'flex', alignItems: 'end', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: CssSizes.tiny, paddingBottom: CssSizes.tiny }}>
                        <Fab onClick={_ => setAttach(true)} size='small' >
                            <AttachFile fontSize="small" />
                        </Fab>
                        <Fab onClick={_ => setShare(true)} size='small' color="primary" >
                            <Share fontSize="small" />
                        </Fab>
                    </div>
                    <div style={{ textAlign: 'right', paddingRight: CssSizes.hairpin }}>
                        <GlassText size="moderate">{getFileSizes(file).total}</GlassText>
                        <GlassText size="small">{getArchiveMessage()}</GlassText>
                    </div>
                </div>
            </div>

            {attachedFiles.length > 0 && <div style={{ paddingTop: CssSizes.tiny }}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />} >
                        <GlassText size="moderate">Attached Files</GlassText>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={1}>
                            {attachedFiles.map(attachedFile => <>
                                <Divider />
                                <div>
                                    <GlassText size="moderate">{attachedFile.name}</GlassText>
                                    <DownloadPanel file={attachedFile} projectSettings={properties.selectedProject?.projectSettings} />
                                </div>
                            </>)}
                        </Stack>
                    </AccordionDetails>
                </Accordion>
            </div>}
        </ColorGlassCard>
        <ShareFile file={file} state={share} close={() => setShare(false)} />
        <AttachAFile file={file} state={attach} close={() => setAttach(false)} />
    </>
}

export default FileViewerTall