import { Colours } from "@/constants/Colours"
import { ButtonBase } from "@mui/material"
import GlassText from "../glassmorphism/GlassText"
import { useState } from "react"
import { StoredFile } from "@/types/server/ProjectResult"
import { isError } from "@/api/isError"
import { useAuth } from "@/contexts/AuthContext"
import { getExtension } from "@/helpers/FileProperties"
import { VideoFiles } from "@/constants/VideoFiles"
import { AudioFiles } from "@/constants/AudioFiles"
import GlassVideo from "../glassmorphism/GlassVideo"
import { useThumbnail } from "@/contexts/ThumbnailContext"

type Props = {
    file: StoredFile,
    playing?: boolean
    height?: number
}

const MediaContent = ({ file, height = 200 }: Props) => {
    const { authAction } = useAuth()
    const { thumbnails } = useThumbnail()
    const thumbnail = thumbnails[file.id]
    const [preview, setPreview] = useState<string | null>(null)

    const extension = getExtension(file.name).toLocaleLowerCase()
    const videoFiles = file.created != null && VideoFiles.includes(extension)
    const transcoded = file.proxyState == 'COMPLETE'
    const isAudio = file.created != null && AudioFiles.includes(extension)

    const showPreview = async (file: StoredFile) => {
        let response
        if (isAudio || (!transcoded && videoFiles)) response = await authAction<{ url: string }>(`file-download/${file.id}/RAW`, 'GET')
        if (response && !isError(response)) setPreview(response.url)
    }

    return <>
        {thumbnail && !preview && !videoFiles && <ButtonBase
            style={{ backgroundColor: Colours.black, height: height + 5, flex: 1, minWidth: 300 }}
        >
            <div style={{ position: 'relative', width: '100%' }}>
                <img src={thumbnail} width='100%' height={height + 10} style={{ objectFit: 'contain' }} onClick={_ => showPreview(file)} />
            </div>
        </ButtonBase >}
        {videoFiles && <div style={{ flex: 1 }}><GlassVideo file={file} placeholder={thumbnail} /></div>}
        {isAudio && preview && <ButtonBase style={{ backgroundColor: Colours.black, height: height + 5, flex: 1, minWidth: 300 }} >
            <div style={{ position: 'relative', width: '100%', height: '100%' }} onClick={_ => setPreview(null)}>
                <GlassText size="small" color="primary" style={{ alignSelf: 'center' }}>Some audio clips may not be possible to preview</GlassText>
                <audio controls autoPlay={true} style={{ width: '90%' }}>
                    <source src={preview} />
                    Your browser does not support the audio element.
                </audio>
            </div>
        </ButtonBase>}
    </>
}

export default MediaContent