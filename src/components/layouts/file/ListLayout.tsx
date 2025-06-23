import { useWindowVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import FileViewer from "@/components/widgets/FileViewer"
import { useThumbnail } from "@/contexts/ThumbnailContext"
import { StoredFile } from "@/types/server/ProjectResult"
import { Stack } from "@mui/material"
import moment from "moment"
import { useSize } from '@/hooks/useSize';
import { ScreenWidths } from '@/constants/ScreenWidths';
import { useRef } from 'react';

type Props = {
    files: StoredFile[]
}

const ListLayout = ({ files }: Props) => {
    const { width } = useSize()
    const itemHeight = width > ScreenWidths.Mobile ? 60 : 300
    const rowHeight = itemHeight * 1.3
    const { getUrl } = useThumbnail()
    const sorted = files.sort((a, b) => moment(a.fileLastModified).diff(b.fileLastModified))

    const rowVirtualizer = useWindowVirtualizer({
        count: sorted.length,
        estimateSize: () => rowHeight,
        overscan: 5,
    });

    return <Stack spacing={1} height='100%' width='100%'>
        <div
            style={{
                height: rowVirtualizer.getTotalSize(),
                width: '100%',
                position: 'relative',
            }}
        >
            <div style={{ position: 'relative', width: '100%' }}>
                {rowVirtualizer.getVirtualItems().map((virtualRow: VirtualItem) => (
                    <div
                        key={virtualRow.key}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            transform: `translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin}px)`,
                        }}
                    >
                        <FileViewer
                            file={files[virtualRow.index]}
                            thumbnail={getUrl(files[virtualRow.index])}
                            height={itemHeight}
                        />
                    </div>
                ))}
                <div style={{ height: rowVirtualizer.getTotalSize() }} />
            </div>
        </div>
    </Stack>
}

export default ListLayout