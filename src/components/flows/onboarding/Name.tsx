import { TextField } from "@mui/material";
import GlassSpace from "../../glassmorphism/GlassSpace";
import GlassText from "../../glassmorphism/GlassText";
import { useAuth } from "@/contexts/AuthContext";

const Name = () => {
    const { setUserAttributes, user } = useAuth()

    return <>
        <GlassText size='massive' style={{}}>
            <b>Creativity</b> Starts <i>Here</i>
        </GlassText>
        <GlassText size='large' style={{}}>
            Whats your name?
        </GlassText>
        <GlassSpace size='small' />
        <div style={{
            display: 'flex',
            flexDirection: 'row',
        }}>
            <TextField
                defaultValue={user.firstName}
                onChange={(e) => setUserAttributes({ firstName: e.target.value })}
                label='First Name'
            />
            <GlassSpace size='hairpin' />
            <TextField
                defaultValue={user.lastName}
                onChange={(e) => setUserAttributes({ lastName: e.target.value })}
                label='Last Name'
            />
        </div>
    </>
}

export default Name