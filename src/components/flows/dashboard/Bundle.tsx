import ColorGlassCard from "@/components/glassmorphism/ColorGlassCard"
import GlassText from "@/components/glassmorphism/GlassText"
import FilePresenter from "@/components/widgets/FilePresenter"
import { useAction } from "@/contexts/actions/infrastructure/ActionContext"
import { useDashboard } from "@/contexts/DashboardContext"
import { useThumbnail } from "@/contexts/ThumbnailContext"
import { Collaborator } from "@/types/Collaborator"
import { ArrowCircleLeft } from "@mui/icons-material"
import { Stack, IconButton, Divider } from "@mui/material"
import { useEffect } from "react"
import { useNavigate } from "react-router"

const Cluster = () => {
    const { properties, updateProperties } = useDashboard()
    const navigate = useNavigate()
    const { getBundleById } = useAction()
    const { retrieveThumbnails } = useThumbnail()

    useEffect(() => {
        if (properties.selectedBundleId)
            getBundleById(properties.selectedBundleId).then(bundle => {
                const members: Collaborator[] = bundle?.bundleUsers?.map(bundleUser => ({
                    ...bundleUser.user,
                    role: bundleUser.isOwner ? 'OWNER' : 'VIEWER'
                })) ?? []
                updateProperties({ selectedBundle: bundle, collaborators: members })
                retrieveThumbnails(bundle?.bundleFiles?.map(bundleFile => bundleFile.file) ?? [])
            })
    }, [properties.selectedBundleId])

    const back = () => {
        updateProperties({ page: 'projects', selectedBundle: undefined, selectedBundleId: undefined })
        navigate('/dashboard')
    }

    return <Stack spacing={1}>
        <ColorGlassCard paddingSize="small">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <IconButton onClick={back} size="large">
                        <ArrowCircleLeft fontSize="large" />
                    </IconButton>
                    <div>
                        <GlassText size="large">{properties.selectedBundle?.name}</GlassText>
                        <GlassText size="moderate">{properties.selectedBundle?.description}</GlassText>
                    </div>
                </div>
                <div style={{ flex: 1 }} />
                <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <GlassText size="large">{properties.selectedBundle?.bundleUsers?.length}</GlassText>
                    <GlassText size="small">Members</GlassText>
                </div>
                <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <GlassText size="large">{properties.selectedBundle?.bundleFiles?.length}</GlassText>
                    <GlassText size="small">Files</GlassText>
                </div>
            </div>
        </ColorGlassCard>
        <Stack spacing={1} height='100%'>
            {properties.selectedBundle?.bundleFiles?.map((bundleFile, index) =>
                <FilePresenter file={bundleFile.file} message={bundleFile.message} isRight={index % 2 == 0} downloadType={bundleFile.downloadProxyType} />
            )}
        </Stack>
    </Stack>
}

export default Cluster