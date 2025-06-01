import { ProjectResult } from "@/types/server/ProjectResult"
import { Stack, Divider, TextField, Button, IconButton } from "@mui/material"
import { useState } from "react"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import BaseModal from "./BaseModal"
import { Add } from "@mui/icons-material"
import { useAuth } from "@/contexts/AuthContext"

type Props = {
    project: ProjectResult,
}

const AddCollaborator = ({ project }: Props) => {
    const { authAction } = useAuth()
    const [addCollaborators, setAddCollaborators] = useState<boolean>(false)
    const [email, setEmail] = useState<string>()

    const inviteCollaborator = async () => {
        authAction<Partial<void>>(`project/add-collaborator/${project.id}/${email}`, 'POST')
    }

    return <>
        <IconButton onClick={() => setAddCollaborators(true)}><Add /></IconButton>
        <BaseModal state={addCollaborators ? "open" : 'closed'} close={() => setAddCollaborators(false)}>
            <GlassSpace size="moderate" style={{ maxHeight: '80vh', overflowY: 'scroll', }}>
                <Stack spacing={2}>
                    <GlassText size='large'>Add Collaborator to {project.name}</GlassText>
                    <Divider />
                    <TextField label='Email' onChange={e => setEmail(e.target.value)} />
                    <Stack direction='row' spacing={2}>
                        <Button
                            onClick={inviteCollaborator}
                            style={{ flex: 1 }}
                            variant="contained"
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