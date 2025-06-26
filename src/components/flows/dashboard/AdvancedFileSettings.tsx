import { useEffect, useState } from "react";
import { Button, Divider, MenuItem, Select, Stack } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import GlassText from "@/components/glassmorphism/GlassText";
import { useDashboard } from "@/contexts/DashboardContext";
import { isError } from "@/api/isError";
import { useAuth } from "@/contexts/AuthContext";
import ProjectSummarySubpage from "@/components/widgets/ProjectSummarySubpage";
import { Save } from "@mui/icons-material";
import { VideoCodecs } from "@/contexts/VideoCodecs";

type Settings = {
    videoCodec: string
}

type SettingsResult = {
    id: string,
    setting: string,
    value: string
}

const AdvancedFileSettings = () => {
    const { authAction, setAlert } = useAuth()
    const { properties } = useDashboard()
    const codecs = Object.keys(VideoCodecs) as (keyof typeof VideoCodecs)[]
    const [settings, setSettings] = useState<Settings>({
        videoCodec: 'APPLE_PRORES_422_PROXY'
    })

    useEffect(() => {
        getProjectSettings()
    }, [])


    const getProjectSettings = async () => {
        const result = await authAction<SettingsResult[]>(`project-setting/${properties.selectedProjectId!}`, 'GET')
        if (!isError(result)) {
            const codecSetting = result.find(setting => setting.setting == 'VIDEO_CODEC')
            if (codecSetting) {
                setSettings(old => ({ ...old, videoCodec: codecSetting.value }))
            }
        }
    }

    const setSetting = async () => {
        const result = await authAction<SettingsResult>(`project-setting`, 'POST', JSON.stringify({
            projectId: properties.selectedProjectId!,
            setting: 'VIDEO_CODEC',
            value: settings.videoCodec
        }))

        if (!isError(result)) {
            setAlert('Successfully updates settings!', 'success')
        }
    }

    return <>
        <ProjectSummarySubpage name='File Settings' />
        <GlassSpace size="small">
            <Stack spacing={1} style={{ maxWidth: 600 }}>
                <Divider />
                <GlassSpace size="tiny" style={{ flex: 1 }}>
                    <GlassText size="large">
                        Video Codec
                    </GlassText>
                    <GlassText size="moderate">
                        For uploaded video files, select the codec to use for generated proxies.
                    </GlassText>
                    <GlassSpace size="tiny" />
                    <Select value={settings?.videoCodec} onChange={e => setSettings(old => ({ ...old, videoCodec: e.target.value }))}>
                        {codecs.map(codec => <MenuItem value={codec}>{VideoCodecs[codec]}</MenuItem>)}
                    </Select>
                </GlassSpace>
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <Button startIcon={<Save />} variant="outlined" style={{ maxWidth: 200 }} onClick={setSetting}>Save</Button>
                </div>
            </Stack>
        </GlassSpace>
    </>
}

export default AdvancedFileSettings
