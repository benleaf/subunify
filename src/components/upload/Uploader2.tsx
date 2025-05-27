import { TaggedFile } from "@/pages/FileUpload"
import { Stack, LinearProgress, CircularProgress, Alert, Chip } from "@mui/material"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useNavigate } from "react-router"
import { useAuth } from "@/auth/AuthContext"
import moment, { Moment } from "moment"
import { useState, useEffect, useRef } from "react"
import { Time } from "@/helpers/Time"
import GlassCard from "../glassmorphism/GlassCard"
import { CssSizes } from "@/constants/CssSizes"
import UploadManager from "@/helpers/UploadManager"

const mb5 = 5 * 1024 * 1024

type Props = {
    taggedFiles: TaggedFile[]
}

const Uploader2 = ({ taggedFiles }: Props) => {
    const fileRecords = taggedFiles.map(file => ({ ...file, description: file.tags.join() }))
    const navigate = useNavigate()
    const { authAction } = useAuth()

    const [totalUploaded, setTotalUploaded] = useState(0)
    const [startTime, setStartTime] = useState<Moment>()
    const [eta, setEta] = useState<string>()
    const [filesInUpload, setFilesInUpload] = useState(new Map<string, { total: number, current: number, percentage: number }>())
    const [mbps, setMbps] = useState<number>()

    const totalSize = fileRecords.length ? fileRecords.map(fileRecord => fileRecord.file.size).reduce((acc, cur) => acc + cur) : 0
    const totalProgress = (totalUploaded / totalSize) * 100

    const uploadManagerRef = useRef<UploadManager>()

    const setProgress = (key: string, bytes: number, total: number) => {
        setFilesInUpload(old => {
            const newMap = new Map(old);
            newMap.set(key, {
                total,
                current: bytes,
                percentage: (bytes / total) * 100
            });
            return newMap;
        });
    }

    useEffect(() => {
        if (totalUploaded === 0 || !startTime) return
        const now = moment()
        const duration = moment.duration(now.diff(startTime))
        const secondsElapsed = duration.asSeconds()
        const uploadSpeed = totalUploaded / secondsElapsed
        setMbps((uploadSpeed * 8) / 1024 / 1024)
        const remainingBytes = totalSize - totalUploaded
        const estimatedSecondsLeft = remainingBytes / uploadSpeed
        setEta(Time.formatDate(moment().add(estimatedSecondsLeft, 'seconds')))
    }, [totalProgress])

    const onComplete = () => {
        console.log("Upload complete")
        navigate('/deep-storage')
    }

    useEffect(() => {
        const abortController = new AbortController()
        setStartTime(moment())
        console.log("Starting upload manager")
        uploadManagerRef.current = new UploadManager(
            authAction,
            setProgress,
            setTotalUploaded,
            onComplete
        )
        uploadManagerRef.current.start(fileRecords)

        return () => {
            console.log("Cleaning up AuthContext");
            uploadManagerRef.current?.cancel()
            abortController.abort()
        };
    }, [])

    return <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <GlassSpace size="big">
            <Stack spacing={2}>
                {totalProgress < 100 && <GlassCard marginSize="big" paddingSize="big">
                    <GlassText size="moderate">
                        <CircularProgress size={CssSizes.moderate} /> Total Progress
                    </GlassText>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <LinearProgress value={totalProgress} variant="determinate" style={{ flex: 1 }} />
                        <GlassText size="moderate">
                            {totalProgress.toFixed(1)}%
                        </GlassText>
                    </Stack>
                    {mbps && <Chip label={`${mbps.toFixed(1)} Mbps`} style={{ marginTop: '1em' }} />}
                    {eta && <Chip label={`Approximately ${eta} remaining`} style={{ marginTop: '1em' }} />}
                </GlassCard>}
                <Alert severity='info'>
                    Upload in progress, please do not close the tab or refresh.
                </Alert>
                {Array.from(filesInUpload, ([fileName, { percentage }]) => ({ fileName, percentage })).map(({ fileName, percentage }) => <div>
                    <GlassText size="moderate">{fileName}</GlassText>
                    <LinearProgress value={percentage ?? 0} variant="determinate" style={{ width: 500 }} />
                </div>
                )}
            </Stack>
            {totalProgress == 100 && <>
                <CircularProgress />
            </>}
        </GlassSpace>
    </div>
}

export default Uploader2
