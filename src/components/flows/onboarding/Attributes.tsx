import { Alert, Stack } from "@mui/material";
import GlassSpace from "../../glassmorphism/GlassSpace";
import GlassText from "../../glassmorphism/GlassText";
import { useAuth } from "@/contexts/AuthContext";
import LimitedText from "../../form/LimitedText";
import { CssSizes } from "@/constants/CssSizes";

const Attributes = () => {
    const { setUserAttributes, user } = useAuth()

    return <>
        <GlassText size='massive' style={{ lineHeight: CssSizes.moderate }}>
            <b>Collaborative.</b>
        </GlassText>
        <GlassText size='moderate'>
            For clients, creators, and teams
        </GlassText>
        <GlassSpace size="tiny" />
        <GlassText size='large' style={{}}>
            SUBUNIFY is a home for collaboration, give people an idea of what <b>your</b> about
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
            </div>
        </Stack>
    </>
}

export default Attributes