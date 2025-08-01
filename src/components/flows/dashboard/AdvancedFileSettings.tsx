import { useEffect, useState } from "react";
import { Alert, Button, Divider, FormControl, FormLabel, MenuItem, Select, Stack } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import GlassText from "@/components/glassmorphism/GlassText";
import { useDashboard } from "@/contexts/DashboardContext";
import ProjectSummarySubpage from "@/components/widgets/ProjectSummarySubpage";
import { Save } from "@mui/icons-material";
import { VideoCodecs } from "@/constants/VideoCodecs";
import { ProjectSettings } from "@/types/server/ProjectResult";
import { useAction } from "@/contexts/actions/infrastructure/ActionContext";

type Settings = Omit<ProjectSettings, 'VIDEO_THUMBNAIL'>


const AdvancedFileSettings = () => {
    const { properties } = useDashboard()
    const { getProjectSettings, setProjectSettings } = useAction()
    const codecs = Object.keys(VideoCodecs) as (keyof typeof VideoCodecs)[]
    const [settings, setSettings] = useState<Omit<Settings, 'RAW' | 'IMAGE_THUMBNAIL'>>({
        VIDEO_CODEC_1080P: 'H_264',
        VIDEO_CODEC_2K: 'NONE',
        VIDEO_CODEC_4K: 'NONE',
    })

    useEffect(() => {
        getSettings()
    }, [])

    const getSettings = async () => {
        const result = await getProjectSettings(properties.selectedProjectId!)
        for (const setting of result) {
            setSettings(old => ({ ...old, [setting.setting]: setting.value }))
        }
    }

    const setSetting = async () => {
        setProjectSettings(properties.selectedProjectId!, settings)
    }

    return <>
        <ProjectSummarySubpage name='File Settings' />
        <GlassSpace size="small">
            <Stack spacing={1} style={{ maxWidth: 600 }}>
                <Divider />
                <Stack spacing={1} style={{ maxWidth: 600 }}>
                    <GlassText size="large">
                        Video Codec
                    </GlassText>
                    <GlassText size="moderate">
                        For uploaded video files, select the codec to use for generated proxies.
                    </GlassText>
                    <Alert severity="info">High quality proxies will use more project storage</Alert>
                    <GlassSpace size="hairpin" />
                    <FormControl style={{ minWidth: 100 }}>
                        <FormLabel>1080P Transcode (1920 x 1080) (used for web previews)</FormLabel>
                        <Select value={settings?.VIDEO_CODEC_1080P} disabled>
                            <MenuItem value='H_264'>{VideoCodecs['H_264']}</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl style={{ minWidth: 100 }}>
                        <FormLabel>2K Transcode (2560 x 1440)</FormLabel>
                        <Select value={settings?.VIDEO_CODEC_2K} onChange={e => setSettings(old => ({ ...old, VIDEO_CODEC_2K: e.target.value }))}>
                            {codecs.map(codec => <MenuItem value={codec}>{VideoCodecs[codec]}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl style={{ minWidth: 100 }}>
                        <FormLabel>4K Transcode (3840 x 2160)</FormLabel>
                        <Select value={settings?.VIDEO_CODEC_4K} onChange={e => setSettings(old => ({ ...old, VIDEO_CODEC_4K: e.target.value }))}>
                            {codecs.map(codec => <MenuItem value={codec}>{VideoCodecs[codec]}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Stack >
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <Button startIcon={<Save />} variant="outlined" style={{ maxWidth: 200 }} onClick={setSetting}>Save</Button>
                </div>
            </Stack >
        </GlassSpace >
    </>
}

export default AdvancedFileSettings
