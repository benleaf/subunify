import { useSize } from "../../hooks/useSize"
import { Stack } from "@mui/material"
import GlassText from "../glassmorphism/GlassText"
import { ComponentSizes } from "@/constants/ComponentSizes"
import { CssSizes } from "@/constants/CssSizes"
import Profile from "../form/Profile"
import ColorGlassCard from "../glassmorphism/ColorGlassCard"
import { useDashboard } from "@/contexts/DashboardContext"
import AddCollaborator from "../modal/AddCollaborator"
import { CollaboratorRoles } from "@/constants/CollaboratorRoles"
import { canAdd } from "@/helpers/Collaborator"

const CollaboratorsPanel = () => {
    const { height } = useSize()
    const { properties } = useDashboard()
    const { selectedProject, collaborators: projectCollaborators } = properties

    return <div style={{
        height: height - ComponentSizes.topBar,
        width: ComponentSizes.sideBar,
        overflow: 'scroll',
        scrollbarWidth: 'none'
    }}>
        <Stack margin={CssSizes.moderate}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <GlassText size="moderate">Collaborators</GlassText>
                {selectedProject && canAdd(properties?.projectRole) && <AddCollaborator project={selectedProject} role={properties?.projectRole} />}
            </div>
            <Stack spacing={1}>
                {!projectCollaborators?.length && <GlassText size="moderate" color="primary">No Project Selected</GlassText>}
                {projectCollaborators?.map(user =>
                    <ColorGlassCard flex={1} paddingSize="hairpin" onClick={console.log} key={user.id}>
                        <Stack direction='row' spacing={2} alignItems='center'>
                            <Profile size="huge" textSize="moderate" user={user} />
                            <div>
                                <GlassText size="moderate">{user.firstName} {user.lastName}</GlassText>
                                <GlassText color="primary" size="small">{CollaboratorRoles[user.role]}</GlassText>
                            </div>
                        </Stack>
                    </ColorGlassCard>
                )}
            </Stack>
        </Stack>
    </div>
}

export default CollaboratorsPanel