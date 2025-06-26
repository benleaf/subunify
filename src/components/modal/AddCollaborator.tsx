import { ProjectResult } from "@/types/server/ProjectResult"
import { Stack, TextField, Button, IconButton } from "@mui/material"
import { useState } from "react"
import GlassSpace from "../glassmorphism/GlassSpace"
import BaseModal from "./BaseModal"
import { Add, Send } from "@mui/icons-material"
import { useAuth } from "@/contexts/AuthContext"
import { isError } from "@/api/isError"
import GlassIconText from "../glassmorphism/GlassIconText"

type Props = {
    project: ProjectResult,
}

const AddCollaborator = ({ project }: Props) => {
    const { authAction, setAlert } = useAuth()
    const [addCollaborators, setAddCollaborators] = useState<boolean>(false)
    const [email, setEmail] = useState<string>()

    const inviteCollaborator = async () => {
        const result = authAction<Partial<void>>(`project/add-collaborator/${project.id}/${email}`, 'POST')

        if (isError(result)) {
            setAlert('Failed to send invitation', 'error')
            console.error(result)
        } else {
            setAlert(`Invitation sent to ${email}`, 'success')
        }

        setAddCollaborators(false)
    }

    return <>
        <IconButton onClick={() => setAddCollaborators(true)}><Add /></IconButton>
        <BaseModal state={addCollaborators ? "open" : 'closed'} close={() => setAddCollaborators(false)}>
            <GlassSpace size="moderate">
                <Stack spacing={2}>
                    <GlassIconText size='large' icon={<Send />}>Send invite...</GlassIconText>
                    <TextField label='Email' onChange={e => setEmail(e.target.value)} />
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