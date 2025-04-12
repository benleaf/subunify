import { ScreenWidths } from "@/constants/ScreenWidths"
import { useSize } from "@/hooks/useSize"
import { Stack, Select, MenuItem, TextField, Slider, Divider } from "@mui/material"
import GlassCard from "../glassmorphism/GlassCard"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useState } from "react"

const CostCalculator = () => {
    const [costCalculatorValue, setCostCalculatorValue] = useState({ size: 'TB', value: 100 })
    const sizeMultiplier = costCalculatorValue.size == 'TB' ? 1 : 2 ** -10
    const totalGB = costCalculatorValue.value * sizeMultiplier
    const deepStorageCost = 1.5
    const initialStorageCost = 6.5

    const costValue = deepStorageCost * totalGB + 0.6
    const initialCost = Math.max(0.5, initialStorageCost * totalGB)
    const { width } = useSize()
    return <>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GlassSpace size='small'>
                <GlassText size="moderate">Calculate your costs before you upload with our calculator</GlassText>
            </GlassSpace>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ maxWidth: ScreenWidths.Mobile, width: '100%' }}>
                <GlassCard flex={1} marginSize="moderate" paddingSize="large">
                    <Stack direction='row' spacing={1} alignItems='center'>
                        <GlassText size="large">Cost Calculator</GlassText>
                        <Select value={costCalculatorValue.size} onChange={e => setCostCalculatorValue(old => ({ ...old, size: e.target.value }))}>
                            <MenuItem value='GB'>GB</MenuItem>
                            <MenuItem value='TB'>TB</MenuItem>
                        </Select>
                        <TextField
                            type="number"
                            style={{ width: '7em' }}
                            value={costCalculatorValue.value}
                            onChange={e => setCostCalculatorValue(old => ({ ...old, value: +(e.target.value ?? 0) }))}
                        />
                    </Stack>
                    <Slider
                        valueLabelDisplay="auto"
                        min={1}
                        max={2 ** 10}
                        value={costCalculatorValue.value}
                        onChange={(_, value) => setCostCalculatorValue(old => ({ ...old, value: +(value ?? 0) }))}
                    />
                    {width <= ScreenWidths.Mobile && <Divider style={{ margin: '0.4em' }} />}
                    <GlassText size="large">${initialCost.toFixed(2)} Initial storage cost</GlassText>
                    <Divider style={{ margin: '0.4em' }} />
                    <GlassText size="large">${costValue.toFixed(2)} Per Month (including $0.60 account fee)</GlassText>
                    {width <= ScreenWidths.Mobile && <Divider style={{ margin: '0.4em' }} />}
                    <GlassText size="moderate">${(costValue * 12).toFixed(2)} Per Year</GlassText>
                </GlassCard>
            </div>
        </div>
    </>
}

export default CostCalculator