import { isError } from "@/api/isError"
import LimitedText from "@/components/form/LimitedText"
import GlassSpace from "@/components/glassmorphism/GlassSpace"
import GlassText from "@/components/glassmorphism/GlassText"
import { CssSizes } from "@/constants/CssSizes"
import { useAuth } from "@/contexts/AuthContext"
import { useDashboard } from "@/contexts/DashboardContext"
import { Project } from "@/types/server/ProjectResult"
import { Button, Stack } from "@mui/material"
import { useState } from "react"

const CreateProject = () => {
    const [project, setProject] = useState<Partial<Project>>({})
    const { authAction } = useAuth()
    const { updateProperties, loadProjects } = useDashboard()

    const createProject = async () => {
        const newProject = await authAction<Project>('project', 'POST', JSON.stringify(project))
        if (!isError(newProject) && newProject) {
            await loadProjects()
            updateProperties({ page: 'project', selectedProjectId: newProject.id })
        }
    }

    return <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
        <Stack spacing={1}>
            <GlassText size='massive' style={{}}>
                <i>Start</i> Something <b>Bold</b>
            </GlassText>
            <GlassText size='large' style={{}}>
                All good things need a name
            </GlassText>
            <GlassSpace size='small' />
            <Stack spacing={1}>
                <LimitedText
                    limit={64}
                    label="Project Name"
                    value={project.name}
                    onChange={(name) => setProject(old => ({ ...old, name }))}
                />
                <LimitedText
                    limit={256}
                    label="Description"
                    value={project.description}
                    onChange={(description) => setProject(old => ({ ...old, description }))}
                />
            </Stack>
        </Stack>
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: CssSizes.hairpin, justifyContent: 'end' }}>
            {project.name && <Button variant="outlined" onClick={createProject}>Create</Button>}
        </div>
    </div>
}

export default CreateProject