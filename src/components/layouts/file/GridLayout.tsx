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
import { Colours } from '@/constants/Colours'
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
    const targetWidth = 115

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
    const totalWidth = columns * targetWidth

    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        estimateSize: () => targetWidth,
        getScrollElement: () => window as any,
        observeElementRect: observeWindowRect,
        observeElementOffset: observeWindowOffset,
        overscan: 2,
    })

    const colVirtualizer = useVirtualizer({
        horizontal: true,
        count: columns,
        estimateSize: () => targetWidth,
        getScrollElement: () => window as any,
        observeElementRect: observeWindowRect,
        observeElementOffset: observeWindowOffset,
        overscan: 2,
    })

    return <div ref={containerRef} style={{ display: 'flex', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: totalWidth }}>
            {rowVirtualizer.getVirtualItems().map((vr) =>
                colVirtualizer.getVirtualItems().map((vc) => {
                    const idx = vr.index * columns + vc.index
                    if (idx >= sorted.length) return null
                    return <ButtonBase style={{
                        position: 'absolute',
                        top: vr.start,
                        left: vc.start,
                        margin: 0,
                        backgroundColor: Colours.lightGrey
                    }} onClick={_ => setPreview(files[idx])}>
                        <img src={getUrl(files[idx])} height={targetWidth} width={targetWidth} style={{ objectFit: 'cover' }} />
                    </ButtonBase >
                })
            )}
            <BaseModal state={preview ? 'open' : 'closed'} close={_ => setPreview(undefined)}>
                {preview && <FileViewerTall file={preview} containerWidth={200} thumbnail={getUrl(preview)} />}
            </BaseModal>
        </div>
    </div>
}

export default GridLayout