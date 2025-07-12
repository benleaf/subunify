import ColorGlassCard from "@/components/glassmorphism/ColorGlassCard"
import GlassIconText from "@/components/glassmorphism/GlassIconText"
import GlassText from "@/components/glassmorphism/GlassText"
import { useAction } from "@/contexts/actions/infrastructure/ActionContext"
import { useAuth } from "@/contexts/AuthContext"
import { useDashboard } from "@/contexts/DashboardContext"
import { Bundle } from "@/types/Bundle"
import { ProjectPreviewResult } from "@/types/server/ProjectResult"
import { Check, Close, Collections, Edit, Info, People } from "@mui/icons-material"
import { Stack, Divider, Chip, IconButton } from "@mui/material"
import moment from "moment"
import { useNavigate } from "react-router"

const isBundle = (item: ProjectPreviewResult | (Bundle & { isOwner: boolean })): item is (Bundle & { isOwner: boolean }) => {
    return 'bundleFiles' in item
}

const isProject = (item: ProjectPreviewResult | (Bundle & { isOwner: boolean })): item is ProjectPreviewResult => {
    return 'availableTBs' in item
}

const Projects = () => {
    const { user } = useAuth()
    const { respondToProjectInvite } = useAction()
    const { properties, updateProperties } = useDashboard()
    const navigate = useNavigate()

    const bundles = properties.bundles?.map(
        bundle => ({
            ...bundle,
            isOwner: bundle.bundleUsers?.find(bundleUser => bundleUser.user.id == user.id)?.isOwner ?? false
        })
    ) ?? []

    const items = [...properties.projects ?? [], ...bundles]
        .sort((a, b) => moment(b.modified).diff(a.modified))

    const onSelectItem = (item: typeof items[number]) => {
        if (isProject(item) && item.inviteAccepted) updateProperties({ page: 'project', selectedProjectId: item.id })
        if (isBundle(item)) {
            navigate(`/dashboard?bundleId=${item.id}`)
            updateProperties({ page: 'bundle' })
        }
    }

    return <Stack spacing={1}>
        {!properties.projects?.length && <ColorGlassCard paddingSize="small" onClick={() => updateProperties({ page: 'createProject' })}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                    <GlassIconText size="large" icon={<Edit />}>Create New Project</GlassIconText>
                    <GlassText size="small">Create - Invite - Add Storage - Upload - Share</GlassText>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                    <GlassText size="small">Free</GlassText>
                </div>
            </div>
        </ColorGlassCard>}
        {items?.map(item =>
            <ColorGlassCard paddingSize="small" onClick={() => onSelectItem(item)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                        <GlassText size="large">{item.name}</GlassText>
                        <GlassText size="moderate">{item.description}</GlassText>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                        {isBundle(item) && <Stack direction='row' spacing={1} alignItems='center'>
                            {item.isOwner && <Chip icon={<Info />} label='Owner' />}
                            <Chip icon={<People />} label='Share Bundle' />
                            <Divider orientation="vertical" style={{ height: 50 }} />
                            <div>
                                <GlassText size="large">{item.bundleFiles?.length}</GlassText>
                                <GlassText size="small">Files</GlassText>
                            </div>
                            <Divider orientation="vertical" style={{ height: 50 }} />
                            <div>
                                <GlassText size="large">{item.bundleUsers?.length}</GlassText>
                                <GlassText size="small">Recipients</GlassText>
                            </div>
                        </Stack>}
                        {isProject(item) && item.inviteAccepted && <Stack direction='row' spacing={1} alignItems='center'>
                            {item.owner.id == user.id && <Chip icon={<Info />} label='Owner' />}
                            <Chip icon={<Collections />} label='Project' />
                            <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                            <div>
                                <GlassText size="large">{item.availableTBs} TB</GlassText>
                                <GlassText size="small">Available</GlassText>
                            </div>
                            <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                            <div>
                                <GlassText size="large">{item.collaborators}</GlassText>
                                <GlassText size="small">Collaborators</GlassText>
                            </div>
                        </Stack>}
                        {isProject(item) && !item.inviteAccepted && <>
                            <Chip icon={<Info />} label='Invitation Pending' />
                            <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                            <IconButton onClick={() => respondToProjectInvite(item.id, true)} color="primary">
                                < Check />
                            </IconButton>
                            <IconButton onClick={() => respondToProjectInvite(item.id, false)} color="primary">
                                < Close />
                            </IconButton>
                        </>}
                    </div>
                </div>
            </ColorGlassCard>
        )}
    </Stack>
}

export default Projects