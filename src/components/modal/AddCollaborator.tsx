import { ProjectResult } from "@/types/server/ProjectResult"
import { Stack, TextField, Button, IconButton, MenuItem, Select } from "@mui/material"
import { useState } from "react"
import GlassSpace from "../glassmorphism/GlassSpace"
import BaseModal from "./BaseModal"
import { Add, PersonAdd, Send, Settings } from "@mui/icons-material"
import { useAuth } from "@/contexts/AuthContext"
import { isError } from "@/api/isError"
import GlassIconText from "../glassmorphism/GlassIconText"
import { CollaboratorRoles, CollaboratorRolesManager, CollaboratorRolesOwner, CollaboratorRolesThatCanAdd } from "@/constants/CollaboratorRoles"
import { getEditableRoles } from "@/helpers/Collaborator"

type Props = {
    project: ProjectResult,
    role?: keyof typeof CollaboratorRolesThatCanAdd
    buttonType?: 'ICON' | 'TEXT'
}

type Settings = {
    projectId: string
    email?: string
    role?: keyof typeof CollaboratorRoles
}

const AddCollaborator = ({ project, role = 'MANAGER', buttonType = 'ICON' }: Props) => {
    const { authAction, setAlert } = useAuth()
    const [addCollaborators, setAddCollaborators] = useState<boolean>(false)
    const [settings, setSettings] = useState<Settings>({ projectId: project.id, role: 'VIEWER' })

    const inviteCollaborator = async () => {
        const result = authAction<Partial<void>>(`project/add-collaborator`, 'POST', JSON.stringify(settings))

        if (isError(result)) {
            setAlert('Failed to send invitation', 'error')
            console.error(result)
        } else {
            setAlert(`Invitation sent to ${settings.email}`, 'success')
        }

        setAddCollaborators(false)
    }

    return <>
        {buttonType == 'ICON' && <IconButton onClick={() => setAddCollaborators(true)}><Add /></IconButton>}
        {buttonType == 'TEXT' && <Button variant="outlined" startIcon={<PersonAdd />} onClick={() => setAddCollaborators(true)}>Add Collaborator</Button>}
        <BaseModal state={addCollaborators} close={() => setAddCollaborators(false)}>
            <GlassSpace size="moderate">
                <Stack spacing={2}>
                    <GlassIconText size='large' icon={<Send />}>Send invite...</GlassIconText>
                    <TextField label='Email' onChange={e => setSettings(old => ({ ...old, email: e.target.value }))} />
                    <Select
                        value={settings.role}
                        onChange={e => setSettings(old => ({ ...old, role: e.target.value as keyof typeof CollaboratorRoles }))}
                    >
                        {getEditableRoles(role).map(role => <MenuItem value={role}>{CollaboratorRoles[role]}</MenuItem>)}
                    </Select>
                    <GlassIconText icon={<Add />} size="small">
                        {settings.role == 'VIEWER' && 'View & Download'}
                        {settings.role == 'MANAGER' && 'View, Download, Upload and add new collaborators'}
                        {settings.role == 'COLLABORATOR' && 'View, Download and Upload'}
                    </GlassIconText>
                    <Stack direction='row' spacing={2}>
                        <Button
                            onClick={inviteCollaborator}
                            style={{ flex: 1 }}
                            variant="outlined"
                        >
                            Invite
                        </Button>
                    </Stack>
                </Stack>
            </GlassSpace>
        </BaseModal>
    </>
}

export default AddCollaborator