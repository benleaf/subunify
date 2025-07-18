import GlassText from "../glassmorphism/GlassText"
import { useState } from "react"
import { StoredFile } from "@/types/server/ProjectResult"
import { getExtension } from "@/helpers/FileProperties"
import { VideoFiles } from "@/constants/VideoFiles"
import { AudioFiles } from "@/constants/AudioFiles"
import GlassVideo from "../glassmorphism/GlassVideo"
import { useThumbnail } from "@/contexts/ThumbnailContext"
import { ImageFiles } from "@/constants/ImageFiles"
import GlassImage from "../glassmorphism/GlassImage"

type Props = {
    file: StoredFile,
    playing?: boolean
    height?: number
}

const MediaContent = ({ file, height = 300 }: Props) => {
    const { thumbnails } = useThumbnail()
    const thumbnail = thumbnails[file.id]
    const [preview, setPreview] = useState<string | null>(null)

    const extension = getExtension(file.name).toLocaleLowerCase()
    const videoFiles = file.created != null && VideoFiles.includes(extension)
    const isAudio = file.created != null && AudioFiles.includes(extension)
    const isImage = file.created != null && ImageFiles.includes(extension)

    return <>
        {videoFiles && <GlassVideo file={file} placeholder={thumbnail} height={height} />}
        {thumbnail && isImage && <GlassImage src={thumbnail} height={height} />}
        {isAudio && <div style={{ position: 'relative', width: '100%', height: '100%' }} onClick={_ => setPreview(null)}>
            <GlassText size="moderate" color="primary" style={{ alignSelf: 'center' }}>Some audio clips may not be possible to preview</GlassText>
            {preview && <audio controls autoPlay={true} style={{ width: '90%' }}>
                <source src={preview} />
                Your browser does not support the audio element.
            </audio>}
        </div>}
    </>
}

export default MediaContent