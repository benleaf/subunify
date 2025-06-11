import { ScreenWidths } from "@/constants/ScreenWidths"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useSize } from "@/hooks/useSize"
import { useRef, useLayoutEffect, RefObject, useEffect, useMemo, useState, Fragment } from "react"
import { gsap } from 'gsap';
import FileViewer from "../widgets/FileViewer"
import { Alert, CircularProgress, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { B, C, D, E, H } from '@/images/stock'
import { CssSizes } from "@/constants/CssSizes"
import { getFileSize } from "@/helpers/FileSize"
import { UploadingFileRecord } from "@/helpers/UploadManager"




const HyperSpeedUpload = () => {
    const { width } = useSize()

    const [scrollPosition, setScrollPosition] = useState(0);

    const handleScroll = () => {
        setScrollPosition(window.pageYOffset);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const displayableFiles = (progress: number) => {
        const offsets = [70, 65, 60, 50, 45, 35, 30, 20, 15, 10, 0];
        const pullBack = width > ScreenWidths.Tablet ? 20 : 50;
        return offsets.map(offset => ({
            chunks: 100,
            uploadedChucks: Math.min(100, 2 * (progress - pullBack) + offset),
            file: { name: `A001C001_0000${offset}.mov`, size: offset * 100000000 + 10000000000 } as File,
            started: true,
            projectId: 'test',
            description: '',
            finished: false
        }))
    }

    const FileUpload = () => <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: width > ScreenWidths.Tablet ? '30vw' : '100%' }}>
        <TableContainer>
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>File Name</TableCell>
                        <TableCell>Size</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayableFiles((scrollPosition - 800) / 16)?.map((fileRecord, index) => <Fragment key={index}>
                        <TableRow >
                            <TableCell>
                                {fileRecord.file.name}
                            </TableCell>
                            <TableCell>{getFileSize(fileRecord.file.size)}</TableCell>
                        </TableRow>
                        {fileRecord.uploadedChucks > 0 && <TableRow key={index} >
                            <TableCell colSpan={2}>
                                <LinearProgress variant="determinate" value={100 * fileRecord.uploadedChucks / fileRecord.chunks} />
                            </TableCell>
                        </TableRow>}
                    </Fragment>)}
                    {!displayableFiles?.length && <TableRow key='empty' >
                        <TableCell colSpan={2}>
                            <Alert severity='info'>
                                Add Files To Start Upload.
                            </Alert>
                        </TableCell>
                    </TableRow>}
                </TableBody>
            </Table>
        </TableContainer>
    </div>

    return <>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            {width > ScreenWidths.Tablet && <div style={{ display: 'flex', height: '70vh', alignItems: 'center' }}>
                <FileUpload />
            </div>}
            <div style={{ display: 'flex', height: '50vh', alignItems: 'center', maxWidth: 750 }}>
                <GlassSpace size='moderate' style={{ flex: 1 }}>
                    <div style={{ position: 'relative' }}>
                        <GlassText
                            size="gigantic"
                            style={{ lineHeight: '1em', fontWeight: 500 }}
                            color="primary"
                        >Faster.</GlassText>
                    </div>
                    <div>
                        <GlassText
                            size="big"
                            style={{ letterSpacing: '0.15em', fontWeight: 'lighter' }}
                            color="primary"
                        >Upload speeds of up to <b>20 times</b> greater then other platforms</GlassText>
                    </div>
                    <div style={{ padding: '0.5em' }} />
                    {width <= ScreenWidths.Tablet && <>
                        <FileUpload />
                    </>}
                </GlassSpace>
            </div>
        </div>
    </>
}

export default HyperSpeedUpload