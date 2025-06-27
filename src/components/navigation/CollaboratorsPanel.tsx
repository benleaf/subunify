import { useSize } from "../../hooks/useSize"
import { Stack } from "@mui/material"
import GlassText from "../glassmorphism/GlassText"
import { ComponentSizes } from "@/constants/ComponentSizes"
import { CssSizes } from "@/constants/CssSizes"
import Profile from "../form/Profile"
import ColorGlassCard from "../glassmorphism/ColorGlassCard"
import { useDashboard } from "@/contexts/DashboardContext"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { isError } from "@/api/isError"
import AddCollaborator from "../modal/AddCollaborator"
import { Collaborator } from "@/types/Collaborator"
import { CollaboratorRoles, CollaboratorRolesThatCanAdd } from "@/constants/CollaboratorRoles"

const CollaboratorsPanel = () => {
    const { height } = useSize()
    const { authAction, user } = useAuth()
    const { properties, loadProject, updateProperties } = useDashboard()
    const { selectedProjectId, selectedProject } = properties

    const [collaborators, setCollaborators] = useState<Collaborator[]>([])

    const getCollaborators = async () => {
        const collaborators = await authAction<Partial<Collaborator[]>>(`project/collaborators/${selectedProjectId}`, 'GET')
        if (!isError(collaborators)) {
            setCollaborators(collaborators.filter(collaborator => collaborator !== undefined))
            const userRole = collaborators.find(collaborator => collaborator?.email == user.email)?.role
            updateProperties({ projectRole: userRole })
        }
    }

    useEffect(() => {
        loadProject(selectedProjectId)
        if (selectedProjectId) {
            getCollaborators()
        } else {
            setCollaborators([])
        }
    }, [selectedProjectId])

    const canAdd = (role?: Collaborator['role']): role is keyof typeof CollaboratorRolesThatCanAdd => {
        return Object.keys(CollaboratorRolesThatCanAdd).includes(role ?? 'VIEWER')
    }

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
                {!collaborators.length && <GlassText size="moderate" color="primary">No Project Selected</GlassText>}
                {collaborators.map(user =>
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