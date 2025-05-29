import { Button, Stack, TextField } from "@mui/material";
import GlassText from "../../glassmorphism/GlassText";
import GlassCard from "../../glassmorphism/GlassCard";
import Profile from "../../form/Profile";
import { User } from "@/types/User";

const Collaborators = () => {
    const fakeUsers: Partial<User>[] = [
        { firstName: 'Hannah', lastName: 'Jones', tagLine: 'Freelance Video Editor based out of Brooklyn' },
        { firstName: 'Sam', lastName: 'Timon', tagLine: 'Line Producer working mainly on commercials' },
        { firstName: 'Chris', lastName: 'Smith', tagLine: 'Freelance Camera Operator' },
        { firstName: 'Laura', lastName: 'Carter', tagLine: 'Digital Imaging Technician of 10 years' },
        { firstName: 'Abby', lastName: 'Taylor', tagLine: 'NY based photographer and videographer' },
    ]

    return <>
        <GlassText size='massive'>
            <b>Collaboration</b> as an <i>art</i>
        </GlassText>
        <GlassText size='large' style={{}}>
            Create in community, innovate together
        </GlassText>
        <Stack direction='column' spacing={1}>
            <TextField fullWidth label='Search People to collaborate with' />
            {fakeUsers.map(user => <div>
                <GlassCard paddingSize="tiny">
                    <Stack direction='row' spacing={2}>
                        <Profile user={user} />
                        <div style={{ flex: 1 }}>
                            <GlassText size="large">{user.firstName} {user.lastName}</GlassText>
                            <GlassText size="moderate">{user.tagLine}</GlassText>
                        </div>
                        <Button variant="outlined">Portfolio</Button>
                        <Button variant="outlined">Request</Button>
                    </Stack>
                </GlassCard>
            </div>
            )}
        </Stack>
    </>
}

export default Collaborators