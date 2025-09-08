import {
    useVirtualizer,
    observeWindowRect,
    observeWindowOffset,
} from '@tanstack/react-virtual'
import { useThumbnail } from "@/contexts/ThumbnailContext"
import { StoredFile } from "@/types/server/ProjectResult"
import { ButtonBase } from "@mui/material"
import moment from "moment"
import { useEffect, useRef, useState } from 'react';
import BaseModal from '@/components/modal/BaseModal'
import FileViewerTall from '@/components/widgets/FileViewerTall'

type Props = {
    files: StoredFile[]
}


const GridLayout = ({ files }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const { getUrl } = useThumbnail()
    const sorted = files.sort((a, b) => moment(a.fileLastModified).diff(b.fileLastModified))
    const [containerWidth, setContainerWidth] = useState(0)
    const [preview, setPreview] = useState<StoredFile>()
    const targetWidth = 100

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const measure = () => setContainerWidth(el.getBoundingClientRect().width)
        measure()
        const ro = new ResizeObserver(() => measure())
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const columns = Math.max(1, Math.floor(containerWidth / targetWidth))
    const rowCount = Math.ceil(sorted.length / columns)
    const imageWidth = containerWidth / columns
    const containerHeight = Math.ceil(rowCount * imageWidth)

    return <div ref={containerRef} style={{ display: 'flex', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '100%', height: containerHeight }}>
            {files.map(file => <ButtonBase onClick={_ => setPreview(file)}>
                <img src={getUrl(file)} height={imageWidth} width={imageWidth} style={{ objectFit: 'cover', padding: 1 }} />
            </ButtonBase >)}
            <BaseModal state={preview !== undefined} close={_ => setPreview(undefined)}>
                {preview && <FileViewerTall file={preview} containerWidth={200} thumbnail={getUrl(preview)} />}
            </BaseModal>
        </div>
    </div>
}

export default GridLayout