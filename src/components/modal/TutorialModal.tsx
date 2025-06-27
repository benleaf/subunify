import { Button, Checkbox, Divider, FormControlLabel, Stack } from "@mui/material";
import GlassSpace from "../glassmorphism/GlassSpace";
import BaseModal from "./BaseModal";
import GlassText from "../glassmorphism/GlassText";
import { ReactNode, useState } from "react";

type Props = {
    modalName: string,
    children: ReactNode | ReactNode[] | undefined
}

const TutorialModal = ({ modalName, children }: Props) => {
    const [tutorialModal, setTutorialModal] = useState(!localStorage.getItem(modalName))
    const [dontShowAgain, setDontShowAgain] = useState(false)

    const closeTutorialModal = () => {
        setTutorialModal(false)
        if (dontShowAgain) {
            localStorage.setItem(modalName, '1')
        }
    }

    return <BaseModal state={tutorialModal} maxWidth={700} close={closeTutorialModal}>
        <GlassSpace size="moderate" style={{ maxHeight: '80vh' }}>
            <Stack spacing={2}>
                {children}
                <Divider />
                <Stack direction='row' spacing={2}>
                    <Button
                        style={{ flex: 1 }}
                        variant="contained"
                        onClick={closeTutorialModal}
                    >
                        Got It!
                    </Button>
                </Stack>
            </Stack>
            <GlassText size="tiny">
                <FormControlLabel control={<Checkbox />} label="Don't Show again" onChange={(_, checked) => setDontShowAgain(checked)} />
            </GlassText>
        </GlassSpace>
    </BaseModal>
};

export default TutorialModal