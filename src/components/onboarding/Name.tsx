import { TextField } from "@mui/material";
import GlassSpace from "../glassmorphism/GlassSpace";
import GlassText from "../glassmorphism/GlassText";
import { useAuth } from "@/auth/AuthContext";

const Name = () => {
    const { setUserAttributes } = useAuth()

    return <>
        <GlassText size='huge' style={{}}>
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
            <TextField onChange={(e) => setUserAttributes({ firstName: e.target.value })} label='First Name' />
            <GlassSpace size='hairpin' />
            <TextField onChange={(e) => setUserAttributes({ lastName: e.target.value })} label='Last Name' />
        </div>
    </>
}

export default Name