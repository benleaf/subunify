import { Stack } from "@mui/material";
import GlassSpace from "../../glassmorphism/GlassSpace";
import GlassText from "../../glassmorphism/GlassText";

const HowAProjectWorks = () => {
    return <>
        <GlassText size='massive'>
            It works
        </GlassText>
        <Stack spacing={1}>
            <GlassText size='big'>
                Upload Fast
            </GlassText>
            <GlassText size='moderate'>
                Take advantage of the highest cloud storage upload speeds available.
                All files can be uploaded at speeds of 1 Gbps (1000 Mbps)
            </GlassText>
            <GlassSpace size='tiny' />
            <GlassText size='big'>
                Share Instantly
            </GlassText>
            <GlassText size='moderate'>
                Collaborators move faster. Once an individual file is uploaded it can be accessed strait away. Again at Gb speeds.
            </GlassText>
            <GlassSpace size='tiny' />
            <GlassText size='big'>
                Archive Automatically
            </GlassText>
            <GlassText size='moderate'>
                End file management hell. Three months after a project is started,
                all files are archived automatically.
            </GlassText>
        </Stack>

    </>
}

export default HowAProjectWorks