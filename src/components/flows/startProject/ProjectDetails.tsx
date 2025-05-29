import GlassSpace from "../../glassmorphism/GlassSpace";
import GlassText from "../../glassmorphism/GlassText";
import LimitedText from "@/components/form/LimitedText";
import ColorGlassCard from "@/components/glassmorphism/ColorGlassCard";
import { useCreateProject } from "@/contexts/CreateProjectContext";
import { Stack, Alert } from "@mui/material";

const ProjectDetails = () => {
    const { updateProject, project } = useCreateProject()
    return <>
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
                onChange={(name) => updateProject({ name })}
            />
            <LimitedText
                limit={64}
                label="Public Code Name"
                value={project.codeName}
                onChange={(codeName) => updateProject({ codeName })}
            />
            <Alert>Help collaborators find the project using a public code name</Alert>
            <LimitedText
                limit={256}
                label="Description"
                value={project.description}
                onChange={(description) => updateProject({ description })}
            />
        </Stack>
    </>
}

export default ProjectDetails