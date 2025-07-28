import { StoredFile } from "@/types/server/ProjectResult"
import GlassSpace from "../glassmorphism/GlassSpace"
import BaseModal from "./BaseModal"
import { useState } from "react"
import { useAction } from "@/contexts/actions/infrastructure/ActionContext"
import GlassText from "../glassmorphism/GlassText"
import { Fab, Stack, TextField } from "@mui/material"
import { AttachFile, Attachment } from "@mui/icons-material"
import { useDashboard } from "@/contexts/DashboardContext"
import GlassImageCard from "../glassmorphism/GlassImageCard"
import { useThumbnail } from "@/contexts/ThumbnailContext"

type Props = {
    file: StoredFile
    state: boolean
    close: () => void
}

const AttachAFile = ({ file, state, close }: Props) => {
    const { addFileAttachment, removeFileAttachment } = useAction()
    const { getUrl } = useThumbnail()
    const { properties } = useDashboard()

    const [search, setSearch] = useState('')
    const [stage, setStage] = useState('package')
    const selectableFiles = properties.selectedProject?.files.filter(currentFile =>
        currentFile.id != file.id &&
        (!search || currentFile.name.includes(search))
    )

    const attachedFiles = selectableFiles?.filter(
        selectableFile => selectableFile.attachedFiles.find(
            attachedFile => attachedFile.attachedFile.id == file.id
        )
    )

    const getAttachedFileId = (targetFileId: string) => {
        const result = selectableFiles
            ?.find(selectableFile => selectableFile.id == targetFileId)
            ?.attachedFiles
            .find(attachedFile => attachedFile?.attachedFile.id == file.id)
            ?.id

        if (!result) throw new Error("Unable to find target attached file");
        return result
    }

    const onModalClose = () => {
        if (stage === 'package' || confirm('Are you sure you wish to close? Closing will result in loss of progress')) {
            onClose()
        }
    }

    const onClose = () => {
        setStage('package')
        close()
    }

    return <BaseModal state={state} close={onModalClose}>
        <GlassSpace size="moderate">
            <Stack spacing={1}>
                <GlassText size="large">Attach to file</GlassText>
                <GlassText size="moderate">Attach this file to another to make it easier to find.</GlassText>
                <TextField label='Search' onChange={e => setSearch(e.target.value)} defaultValue={search} />
                <Stack spacing={1}>
                    {properties.selectedProject?.files && selectableFiles?.map(currentFile => <GlassImageCard height={30} thumbnail={getUrl(currentFile)}>
                        <GlassSpace size="hairpin" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                            <GlassText size="moderate">
                                {currentFile.name}
                            </GlassText>
                            {attachedFiles?.includes(currentFile) &&
                                <Fab onClick={_ => removeFileAttachment(getAttachedFileId(currentFile.id))} size='small' color="primary" >
                                    <Attachment fontSize="small" />
                                </Fab>
                            }
                            {!attachedFiles?.includes(currentFile) &&
                                <Fab onClick={_ => addFileAttachment(currentFile.id, file.id)} size='small' >
                                    <AttachFile fontSize="small" />
                                </Fab>
                            }
                        </GlassSpace>
                    </GlassImageCard>)}
                </Stack>
            </Stack>
        </GlassSpace>
    </BaseModal >
}

export default AttachAFile