import { TextField } from "@mui/material";
import GlassSpace from "../glassmorphism/GlassSpace";
import GlassText from "../glassmorphism/GlassText";
import { useAuth } from "@/auth/AuthContext";

const Account = () => {
    const { setUserAttributes } = useAuth()

    return <>
        <GlassText size='huge' style={{}}>
            <b>Power</b> to the Artist
        </GlassText>
        <GlassText size='large' style={{}}>
            Let's get you an account
        </GlassText>
        <GlassSpace size='small' />

        <TextField onChange={(e) => setUserAttributes({ firstName: e.target.value })} label='Email' />
        <GlassSpace size='hairpin' />
        <TextField onChange={(e) => setUserAttributes({ lastName: e.target.value })} label='Password' />
    </>
}

export default Account