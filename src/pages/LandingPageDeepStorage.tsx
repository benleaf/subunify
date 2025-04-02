import GlassText from "@/components/glassmorphism/GlassText";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { Button, Divider, MenuItem, Select, Slider, Stack, TextField, } from "@mui/material";
import FloatingGlassCircle from "@/components/glassmorphism/FloatingGlassCircle";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import DynamicStack from "@/components/glassmorphism/DynamicStack";
import GlassIconText from "@/components/glassmorphism/GlassIconText";
import { Article, Backup, BallotOutlined, BorderTop, MoveToInbox, StopScreenShare } from "@mui/icons-material";
import { ScreenWidths } from "@/constants/ScreenWidths";
import { useState } from "react";
import ExampleTable from "@/components/TablesDataTable/ExampleTable";

const LandingPageDeepStorage = () => {
    const [costCalculatorValue, setCostCalculatorValue] = useState({ size: 'TB', value: 5, proportion: 1 })
    const sizeMultiplier = costCalculatorValue.size == 'TB' ? 1000 : 1
    const totalGB = costCalculatorValue.value * sizeMultiplier
    const deepStorageCost = 0.005
    const liveCost = 0.05

    const costValue = Math.max(1, (liveCost * (1 - costCalculatorValue.proportion) + (deepStorageCost * costCalculatorValue.proportion)) * totalGB)

    return <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GlassSpace size='moderate' style={{ textAlign: 'center' }}>
                <GlassText size="large" style={{ letterSpacing: '0.15em' }}>SUBUNIFY PRESENTS</GlassText>
                <GlassText size="gigantic" style={{ letterSpacing: '0.15em' }}>DEEP DATA STORAGE</GlassText>
            </GlassSpace>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <DynamicStack>
                <FloatingGlassCircle offset={{ bottom: '-10em', left: '-4em' }} size="medium" />
                <GlassCard marginSize="small">
                    <div style={{ maxWidth: 400, height: 500, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <GlassSpace size={"tiny"} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                            <GlassText size="large">LIVE STORAGE</GlassText>
                            <GlassText size="moderate">
                                <Stack spacing={3} margin='1em'>
                                    <GlassIconText size={"moderate"} icon={<Article color="primary" fontSize="medium" />}>
                                        Access any file with a click of a link
                                    </GlassIconText>
                                    <GlassIconText size={"moderate"} icon={<BorderTop color="primary" fontSize="medium" />}>
                                        Downloads initiated instantly
                                    </GlassIconText>
                                    <GlassIconText size={"moderate"} icon={<Backup color="primary" fontSize="medium" />}>
                                        Data secured on Amazon servers
                                    </GlassIconText>
                                    <GlassIconText size={"moderate"} icon={<BallotOutlined color="primary" fontSize="medium" />}>
                                        Enjoy painless data access using our web forms
                                    </GlassIconText>
                                </Stack>
                            </GlassText>
                            <GlassText size={"large"}>
                                $50 per TB per Month
                            </GlassText>
                        </GlassSpace>
                    </div>
                </GlassCard>
                <Divider orientation="vertical" flexItem><GlassText size="moderate">WITH</GlassText></Divider>
                <GlassCard marginSize="small">
                    <div style={{ maxWidth: 400, height: 500, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <GlassSpace size={"tiny"} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                            <GlassText size="large">DEEP STORAGE</GlassText>
                            <GlassText size="moderate">
                                <Stack spacing={3} margin='1em'>
                                    <GlassIconText size={"moderate"} icon={<StopScreenShare color="primary" fontSize="medium" />}>
                                        Data is inaccessible while in deep storage
                                    </GlassIconText>
                                    <GlassIconText size={"moderate"} icon={<Backup color="primary" fontSize="medium" />}>
                                        Transfers to LIVE storage take 12 hours at $0.1 per GB
                                    </GlassIconText>
                                    <GlassIconText size={"moderate"} icon={<MoveToInbox color="primary" fontSize="medium" />}>
                                        Files moved into DEEP storage immediately upon request
                                    </GlassIconText>
                                </Stack>
                            </GlassText>
                            <GlassText size={"large"}>
                                $5 per TB per Month
                            </GlassText>
                            <Button href="/file-upload">
                                Archive File
                            </Button>
                        </GlassSpace>
                    </div>
                </GlassCard>
                <FloatingGlassCircle offset={{ top: '-2em', right: '-2em' }} size="small" />
            </DynamicStack >
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GlassSpace size='moderate'>
                <GlassText size="large" style={{ letterSpacing: '0.15em' }}>PAY AS YOU GO</GlassText>
                <GlassText size="moderate">Pay monthly for only the data you used, nothing more</GlassText>
            </GlassSpace>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ maxWidth: ScreenWidths.Mobile, width: '100%' }}>
                <GlassCard flex={1} marginSize="moderate" paddingSize="large">
                    <Stack direction='row' spacing={2} alignItems='center'>
                        <GlassText size="large">Cost Calculator</GlassText>
                        <Select value={costCalculatorValue.size} onChange={e => setCostCalculatorValue(old => ({ ...old, size: e.target.value }))}>
                            <MenuItem value='GB'>GB</MenuItem>
                            <MenuItem value='TB'>TB</MenuItem>
                        </Select>
                        <TextField
                            type="number"
                            defaultValue={costCalculatorValue.value}
                            onChange={e => setCostCalculatorValue(old => ({ ...old, value: +(e.target.value ?? 0) }))}
                        />
                    </Stack>
                    <Stack direction='row' spacing={2} alignItems='center'>
                        <div>
                            <GlassText size="small">LIVE</GlassText>
                            <GlassText size="small">{((1 - costCalculatorValue.proportion) * costCalculatorValue.value).toFixed(1)}{costCalculatorValue.size}</GlassText>
                        </div>
                        <Slider
                            min={0}
                            max={100}
                            step={0.1}
                            valueLabelDisplay="auto"
                            valueLabelFormat={value => `${value.toFixed(1)}%`}
                            value={costCalculatorValue.proportion * 100}
                            onChange={(_, value) => setCostCalculatorValue(old => ({ ...old, proportion: (value as number) / 100 }))}
                        />
                        <div>
                            <GlassText size="small">DEEP</GlassText>
                            <GlassText size="small">{(costCalculatorValue.proportion * costCalculatorValue.value).toFixed(1)}{costCalculatorValue.size}</GlassText>
                        </div>
                    </Stack>
                    <GlassSpace size={"tiny"}>
                        <GlassText size="large">${costValue.toFixed(2)} Per Month</GlassText>
                        <GlassText size="moderate">${(costValue * 12).toFixed(2)} Per Year</GlassText>
                    </GlassSpace>
                </GlassCard>
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GlassSpace size='moderate'>
                <GlassText size="large" style={{ letterSpacing: '0.15em' }}>MAINTAIN DATA LIKE A PRO</GlassText>
                <GlassText size="moderate">Keep track of files with our powerful data tables</GlassText>
            </GlassSpace>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ maxWidth: ScreenWidths.Mobile, width: '100%' }}>
                <GlassCard flex={1} marginSize="moderate">
                    <ExampleTable />
                </GlassCard>
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GlassSpace size='moderate'>
                <GlassText size="large" style={{ letterSpacing: '0.15em' }}>CONTACT US TO REQUEST ACCESS</GlassText>
                <GlassText size="moderate">product@subunify.com</GlassText>
            </GlassSpace>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GlassSpace size='huge' style={{ textAlign: 'center' }}>
                <GlassText size="large">SUBUNIFY</GlassText>
            </GlassSpace>
        </div>
    </div >
}

export default LandingPageDeepStorage