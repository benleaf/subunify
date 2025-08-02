import { ProjectResult } from "@/types/server/ProjectResult"
import { Stack, TextField, Button, IconButton, MenuItem, Select } from "@mui/material"
import { useState } from "react"
import GlassSpace from "../glassmorphism/GlassSpace"
import BaseModal from "./BaseModal"
import { Add, PersonAdd, Send } from "@mui/icons-material"
import GlassIconText from "../glassmorphism/GlassIconText"
import { CollaboratorRoles, CollaboratorRolesThatCanAdd } from "@/constants/CollaboratorRoles"
import { getEditableRoles } from "@/helpers/Collaborator"
import { useAction } from "@/contexts/actions/infrastructure/ActionContext"
import { AddCollaboratorSettings } from "@/types/AddCollaboratorSettings"

type Props = {
    project: ProjectResult,
    role?: keyof typeof CollaboratorRolesThatCanAdd
    buttonType?: 'ICON' | 'TEXT'
}

const AddCollaborator = ({ project, role = 'MANAGER', buttonType = 'ICON' }: Props) => {
    const { addProjectCollaborator } = useAction()
    const [addCollaborators, setAddCollaborators] = useState<boolean>(false)
    const [settings, setSettings] = useState<AddCollaboratorSettings>({ projectId: project.id, role: 'VIEWER' })

    const inviteCollaborator = async () => {
        await addProjectCollaborator(settings)
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