import GlassText from "@/components/glassmorphism/GlassText";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { Divider, MenuItem, Select, Slider, Stack, TextField, } from "@mui/material";
import FloatingGlassCircle from "@/components/glassmorphism/FloatingGlassCircle";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import DynamicStack from "@/components/glassmorphism/DynamicStack";
import GlassIconText from "@/components/glassmorphism/GlassIconText";
import { Article, Backup, BallotOutlined, BorderTop, PieChart } from "@mui/icons-material";
import { ScreenWidths } from "@/constants/ScreenWidths";
import { BarChart } from "@mui/x-charts";
import { useSize } from "@/hooks/useSize";
import { useState } from "react";

const LandingPageDeepStorage = () => {
    const { width } = useSize()
    const [costCalculatorValue, setCostCalculatorValue] = useState({ size: 'GB', value: 150, proportion: 0.8 })
    const sizeMultiplier = costCalculatorValue.size == 'TB' ? 1000 : 1
    const totalGB = costCalculatorValue.value * sizeMultiplier
    const deepStorageAWSCost = 0.00099
    const deepStorageCost = 0.005
    const liveAwsCost = 0.024
    const liveCost = 0.05

    const costValue = (liveCost * (1 - costCalculatorValue.proportion) + (deepStorageCost * costCalculatorValue.proportion)) * totalGB
    const profit = costValue - ((liveAwsCost * (1 - costCalculatorValue.proportion)) + (deepStorageAWSCost * costCalculatorValue.proportion)) * totalGB

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
                                        Access any file anywhere with the click of a link over the internet
                                    </GlassIconText>
                                    <GlassIconText size={"moderate"} icon={<BorderTop color="primary" fontSize="medium" />}>
                                        Downloads initiated instantly
                                    </GlassIconText>
                                    <GlassIconText size={"moderate"} icon={<Backup color="primary" fontSize="medium" />}>
                                        Data secured on Amazon servers
                                    </GlassIconText>
                                    <GlassIconText size={"moderate"} icon={<BallotOutlined color="primary" fontSize="medium" />}>
                                        Enjoy painless data access using the power of web forms
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
                            <GlassText size="large">DEEP STORAGE</GlassText><GlassText size="moderate">
                                <Stack spacing={3} margin='1em'>
                                    <GlassIconText size={"moderate"} icon={<BallotOutlined color="primary" fontSize="medium" />}>
                                        Data restricted to two requests per year
                                    </GlassIconText>
                                    <GlassIconText size={"moderate"} icon={<Backup color="primary" fontSize="medium" />}>
                                        12 hour retrieval time
                                    </GlassIconText>
                                    <GlassIconText size={"moderate"} icon={<PieChart color="primary" fontSize="medium" />}>
                                        Accessable only in a 24 hour window or by moving to LIVE mode
                                    </GlassIconText>
                                </Stack>
                            </GlassText>
                            <GlassText size={"large"}>
                                $5 per TB per Month
                            </GlassText>
                        </GlassSpace>
                    </div>
                </GlassCard>
                <FloatingGlassCircle offset={{ top: '-2em', right: '-2em' }} size="small" />
            </DynamicStack >
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GlassSpace size='moderate'>
                <GlassText size="large" style={{ letterSpacing: '0.15em' }}>DYNAMIC PRICING</GlassText>
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
                        <GlassText size="small">LIVE</GlassText>
                        <Slider
                            min={0}
                            max={100}
                            step={0.1}
                            valueLabelDisplay="auto"
                            valueLabelFormat={value => `${value.toFixed(1)}%`}
                            value={costCalculatorValue.proportion * 100}
                            onChange={(_, value) => setCostCalculatorValue(old => ({ ...old, proportion: (value as number) / 100 }))}
                        />
                        <GlassText size="small">DEEP</GlassText>
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
                <GlassText size="large" style={{ letterSpacing: '0.15em' }}>CONTACT US</GlassText>
                <GlassText size="moderate">product@subunify.com</GlassText>
            </GlassSpace>
        </div>
    </div >
}

export default LandingPageDeepStorage