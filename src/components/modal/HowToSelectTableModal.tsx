import { Button, Divider, Stack } from "@mui/material";
import GlassSpace from "../glassmorphism/GlassSpace";
import BaseModal from "./BaseModal";
import GlassText from "../glassmorphism/GlassText";
import { useEffect, useMemo, useState } from "react";
import ExampleSheet from "../sheet/ExampleSheet";

type Props = {
    isOpen: boolean,
    onClose: () => void
}

const gridData = [
    ['', '', '', '', ''],
    ['Name', 'Age', 'Job Description', 'Salary', 'Start Date'],
    ['Samantha Smith', '32', 'Sales', '98,000', '11/4/2017'],
    ['Bob Moses', '44', 'Parks Commissioner', 'N/A', '2/5/1932'],
]

const HowToSelectTableModal = ({ isOpen, onClose }: Props) => {
    const [time, setTime] = useState(Date.now() / 1000)

    const cycleThroughHeader = useMemo(
        () => [...Array(5).keys()].map(
            column => [...Array(4).keys()].map(
                row => row == 1 && column <= ((time % 6) - 1)
            )
        ), [time]
    )

    useEffect(() => {
        const interval = setInterval(() => setTime(Math.floor(Date.now() / 400)), 400)
        return () => { clearInterval(interval) }
    }, [])

    return <BaseModal state={isOpen ? 'open' : 'closed'} maxWidth={700}>
        <GlassSpace size="moderate" style={{ maxHeight: '80vh', overflowY: 'scroll', }}>
            <Stack spacing={2}>
                <GlassText size='large'>Selecting A Header</GlassText>
                <GlassText size='moderate'>Start by selecting the cells that make up your tables header</GlassText>
                <Divider />
                <ExampleSheet gridData={gridData} highlights={cycleThroughHeader} />
                <Stack direction='row' spacing={2}>
                    <Button
                        style={{ flex: 1 }}
                        variant="contained"
                        onClick={onClose}
                    >
                        Got It!
                    </Button>
                </Stack>
            </Stack>
        </GlassSpace>
    </BaseModal>
};

export default HowToSelectTableModal