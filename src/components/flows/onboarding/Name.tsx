import { TextField } from "@mui/material";
import GlassSpace from "../../glassmorphism/GlassSpace";
import GlassText from "../../glassmorphism/GlassText";
import { useAuth } from "@/contexts/AuthContext";
import { CssSizes } from "@/constants/CssSizes";

const Name = () => {
    const { setUserAttributes, user } = useAuth()

    return <>
        <GlassText size='massive' style={{ lineHeight: CssSizes.moderate }}>
            <b>Unified.</b>
        </GlassText>
        <GlassText size='moderate'>
            For all footage and all participants
        </GlassText>
        <GlassSpace size="tiny" />
        <GlassText size='large' style={{}}>
            SUBUNIFY is the unification of people, on a foundation of footage. What <b>name</b> do you want people to see?
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