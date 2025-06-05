import { useSize } from "../../hooks/useSize"
import { Stack } from "@mui/material"
import GlassText from "../glassmorphism/GlassText"
import { ComponentSizes } from "@/constants/ComponentSizes"
import { CssSizes } from "@/constants/CssSizes"
import Profile from "../form/Profile"
import ColorGlassCard from "../glassmorphism/ColorGlassCard"
import { User } from "@/types/User"
import { useDashboard } from "@/contexts/DashboardContext"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { isError } from "@/api/isError"
import AddCollaborator from "../modal/AddCollaborator"

const CollaboratorsPanel = () => {
    const { height } = useSize()
    const { authAction } = useAuth()
    const { properties, loadProject } = useDashboard()
    const { selectedProjectId, selectedProject } = properties

    const [collaborators, setCollaborators] = useState<User[]>([])

    const getCollaborators = async () => {
        const collaborators = await authAction<Partial<User[]>>(`project/collaborators/${selectedProjectId}`, 'GET')
        if (!isError(collaborators)) {
            setCollaborators(collaborators.filter(collaborator => collaborator !== undefined))
            console.log(collaborators)
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


    return <div style={{
        height: height - ComponentSizes.topBar,
        width: ComponentSizes.sideBar,
        overflow: 'scroll',
        scrollbarWidth: 'none'
    }}>
        <Stack margin={CssSizes.moderate}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <GlassText size="moderate">Collaborators</GlassText>
                {selectedProject && <AddCollaborator project={selectedProject} />}
            </div>
            <Stack spacing={1}>
                {collaborators.map(user =>
                    <ColorGlassCard flex={1} paddingSize="hairpin" onClick={console.log}>
                        <Stack direction='row' spacing={2} alignItems='center'>
                            <Profile size="massive" textSize="moderate" user={user} />
                            <GlassText size="moderate">{user.firstName} {user.lastName}</GlassText>
                        </Stack>
                    </ColorGlassCard>
                )}
            </Stack>
        </Stack>
    </div>
}

export default CollaboratorsPanel