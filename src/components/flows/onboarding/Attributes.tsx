import { Alert, Stack } from "@mui/material";
import GlassSpace from "../../glassmorphism/GlassSpace";
import GlassText from "../../glassmorphism/GlassText";
import { useAuth } from "@/contexts/AuthContext";
import GlassCard from "../../glassmorphism/GlassCard";
import LimitedText from "../../form/LimitedText";
import ProfileUpload from "../../form/ProfileUpload";

const Attributes = () => {
    const { setUserAttributes, user } = useAuth()

    return <>
        <GlassText size='massive' style={{}}>
            <b>Illuminate</b> Your Creativity
        </GlassText>
        <GlassText size='large' style={{}}>
            Give others a glimpse of your world
        </GlassText>
        <GlassSpace size='small' />
        <Stack spacing={1}>
            <LimitedText
                limit={64}
                label="Tag Line"
                value={user.tagLine}
                onChange={(tagLine) => setUserAttributes({ tagLine })}
            />
            <LimitedText
                limit={256}
                label="About You"
                value={user.about}
                onChange={(about) => setUserAttributes({ about })}
            />
            <LimitedText
                limit={5}
                label="Zip Code"
                value={user.zipCode}
                onChange={(zipCode) => setUserAttributes({ zipCode })}
            />
            <Alert>Zip codes help you find people to collaborate with</Alert>
            <div style={{ display: 'flex', alignItems: 'center' }} >
                {/* <Wheel
                    style={{ marginLeft: 20 }}
                    color={user.color ?? '#f00'}
                    onChange={(color) => {
                        setUserAttributes({ color: color.hex });
                    }}
                /> */}
                <GlassCard marginSize="moderate" paddingSize="moderate" flex={1}>
                    <Stack direction="row" spacing={2}>
                        <ProfileUpload />
                        <div>
                            <GlassText size="big">{user.firstName} {user.lastName}</GlassText>
                            <GlassText size="moderate">{user.tagLine}</GlassText>
                        </div>
                    </Stack>
                </GlassCard>
            </div>
        </Stack>
    </>
}

export default Attributes