import { useSize } from "../../hooks/useSize"
import { FileUpload, ListAlt } from "@mui/icons-material"
import { ButtonBase, List, ListItem, ListItemButton, ListItemIcon, Stack } from "@mui/material"
import GlassText from "../glassmorphism/GlassText"
import { ComponentSizes } from "@/constants/ComponentSizes"
import { CssSizes } from "@/constants/CssSizes"
import Profile from "../form/Profile"
import ColorGlassCard from "../glassmorphism/ColorGlassCard"
import { User } from "@/types/User"

const CollaboratorsPanel = () => {
    const { height } = useSize()

    const fakeUsers: Partial<User>[] = [
        { firstName: 'Hannah', lastName: 'Jones', tagLine: 'Freelance Video Editor based out of Brooklyn' },
        { firstName: 'Sam', lastName: 'Timon', tagLine: 'Line Producer working mainly on commercials' },
        { firstName: 'Chris', lastName: 'Smith', tagLine: 'Freelance Camera Operator' },
        { firstName: 'Laura', lastName: 'Carter', tagLine: 'Digital Imaging Technician of 10 years' },
        { firstName: 'Abby', lastName: 'Taylor', tagLine: 'NY based photographer and videographer' },
    ]

    return <div style={{
        height: height - ComponentSizes.topBar,
        width: ComponentSizes.sideBar,
        overflow: 'scroll',
        scrollbarWidth: 'none'
    }}>
        <Stack margin={CssSizes.moderate}>
            <GlassText size="moderate">Collaborators</GlassText>
            <Stack spacing={1}>
                {fakeUsers.map(user =>
                    <ColorGlassCard flex={1} paddingSize="hairpin" onClick={console.log}>
                        <Stack direction='row' spacing={2} alignItems='center'>
                            <Profile size="massive" textSize="moderate" user={user} />
                            <GlassText size="moderate">{user.firstName} {user.lastName}</GlassText>
                        </Stack>
                    </ColorGlassCard>
                )}
            </Stack>
        </Stack>
    </div>
}

export default CollaboratorsPanel