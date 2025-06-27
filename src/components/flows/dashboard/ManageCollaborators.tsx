import { isError } from "@/api/isError"
import ColorGlassCard from "@/components/glassmorphism/ColorGlassCard"
import GlassIconText from "@/components/glassmorphism/GlassIconText"
import GlassSpace from "@/components/glassmorphism/GlassSpace"
import GlassText from "@/components/glassmorphism/GlassText"
import AddCollaborator from "@/components/modal/AddCollaborator"
import BaseModal from "@/components/modal/BaseModal"
import ProjectSummarySubpage from "@/components/widgets/ProjectSummarySubpage"
import { CollaboratorRoles } from "@/constants/CollaboratorRoles"
import { useAuth } from "@/contexts/AuthContext"
import { useDashboard } from "@/contexts/DashboardContext"
import { canAdd, getEditableRoles } from "@/helpers/Collaborator"
import { Collaborator } from "@/types/Collaborator"
import { Add, Delete, Edit, Layers } from "@mui/icons-material"
import { Stack, TextField, Divider, Button, MenuItem, Select } from "@mui/material"
import { useEffect, useState } from "react"

const ManageCollaborators = () => {
    const { authAction, setAlert } = useAuth()
    const { properties, updateProperties } = useDashboard()
    const [removeText, setRemoveText] = useState<string>()
    const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator>()
    const [newRole, setNewRole] = useState<Collaborator['role']>()

    useEffect(() => {
        setNewRole(selectedCollaborator?.role)
    }, [selectedCollaborator])

    const order = ['OWNER', 'MANAGER', 'COLLABORATOR', 'VIEWER']

    const canManage = (role: Collaborator['role']) =>
        properties.projectRole &&
        order.indexOf(properties.projectRole) < order.indexOf(role) &&
        canAdd

    const deleteCollaborator = async () => {
        const result = await authAction<Collaborator[]>(`user-project/${properties.selectedProjectId}/${selectedCollaborator?.id}`, 'DELETE')
        if (isError(result)) {
            setAlert('Unable to remove collaborator from project', 'error')
        } else {
            setAlert('Collaborator successfully removed from project', 'success')
            updateProperties({ projectCollaborators: result })
            setSelectedCollaborator(undefined)
        }
    }

    const UpdateCollaborator = async () => {
        if (!selectedCollaborator?.id || !newRole) return

        const result = await authAction<Collaborator[]>(`user-project/role`, 'PATCH', JSON.stringify({
            projectId: properties.selectedProjectId,
            collaboratorId: selectedCollaborator.id,
            newRole,
        }))

        if (isError(result)) {
            setAlert('Unable to update collaborator role', 'error')
        } else {
            setAlert('Collaborator role was successfully updated', 'success')
            updateProperties({ projectCollaborators: result })
            setSelectedCollaborator(undefined)
        }
    }


    return <Stack spacing={1}>
        <ProjectSummarySubpage name='Manage Collaborators' />
        <div style={{ display: 'flex', justifyContent: 'end' }}>
            {canAdd(properties.projectRole) && properties.selectedProject &&
                <AddCollaborator project={properties.selectedProject} role={properties.projectRole} buttonType="TEXT" />
            }
        </div>
        {properties.projectCollaborators?.map(collaborator =>
            <ColorGlassCard paddingSize="small">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                        <GlassText size="large">{collaborator.firstName} {collaborator.lastName}</GlassText>
                        <GlassText size="moderate">{collaborator.role} - {collaborator.email}</GlassText>
                    </div>
                    {canManage(collaborator.role) && <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Button
                                onClick={_ => setSelectedCollaborator(collaborator)}
                                variant="outlined"
                                startIcon={<Layers />}
                            >
                                Manage
                            </Button>
                        </div>
                    </>}
                </div>
            </ColorGlassCard>
        )}
        {selectedCollaborator && canManage(selectedCollaborator.role) && canAdd(properties.projectRole) && <>
            <BaseModal state={selectedCollaborator ? "open" : 'closed'} close={_ => setSelectedCollaborator(undefined)}>
                <GlassSpace size="moderate">
                    <Stack spacing={1}>
                        <GlassText size="big">Change Access</GlassText>
                        <GlassText size="moderate">Update what actions this collaborator is able to perform</GlassText>
                        <Select
                            fullWidth
                            value={newRole ?? selectedCollaborator.role}
                            onChange={e => setNewRole(e.target.value as Collaborator['role'])}
                        >
                            {getEditableRoles(properties.projectRole).map(role => <MenuItem value={role}>{CollaboratorRoles[role]}</MenuItem>)}
                        </Select>
                        <GlassIconText icon={<Add />} size="small">
                            {selectedCollaborator.role == 'VIEWER' && 'View & Download'}
                            {selectedCollaborator.role == 'MANAGER' && 'View, Download, Upload and add new collaborators'}
                            {selectedCollaborator.role == 'COLLABORATOR' && 'View, Download and Upload'}
                        </GlassIconText>
                        <Button
                            onClick={UpdateCollaborator}
                            variant="outlined"
                            startIcon={<Edit />}
                        >
                            Update
                        </Button>
                        <Divider style={{ padding: 5 }} flexItem />
                        <GlassText size="big">Remove From Project</GlassText>
                        <GlassText size="moderate">Remove collaborator from this project, this will prevent them from accessing any files not explicitly shared with them.</GlassText>
                        <TextField onChange={e => setRemoveText(e.target.value)} label='Type "remove collaborator" to remove'></TextField>
                        <Button
                            onClick={deleteCollaborator}
                            variant="outlined"
                            disabled={removeText?.toLocaleLowerCase() !== 'remove collaborator'}
                            startIcon={<Delete />}
                        >
                            Remove
                        </Button>
                    </Stack>
                </GlassSpace>
            </BaseModal>
        </>}
    </Stack>
}

export default ManageCollaborators