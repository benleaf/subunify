import { ScreenWidths } from "@/constants/ScreenWidths"
import { useSize } from "@/hooks/useSize"
import { Stack, Select, MenuItem, TextField, Slider, Divider } from "@mui/material"
import GlassCard from "../glassmorphism/GlassCard"
import GlassText from "../glassmorphism/GlassText"
import { useState } from "react"
import BlackHoleCanvas2 from "../graphics/BlackHoleCanvas2"
import { CssSizes } from "@/constants/CssSizes"

const CostCalculator = () => {
    const [costCalculatorValue, setCostCalculatorValue] = useState<{ size: string, value?: number }>({ size: 'GB', value: 500 })
    const sizeMultiplier = costCalculatorValue.size == 'TB' ? 1 : 2 ** -10
    const totalGB = (costCalculatorValue.value ?? 0) * sizeMultiplier
    const deepStorageCost = 1.5
    const initialStorageCost = 6.5

    const costValue = Math.max(0.6, deepStorageCost * totalGB)
    const initialCost = Math.max(0.5, initialStorageCost * totalGB)
    const { width } = useSize()

    const setInputValue = (value: string) => {
        const valueToStore = value == '' ? undefined : Math.min(+value, 1024)
        setCostCalculatorValue(old => ({ ...old, value: valueToStore }))
    }

    return <>
        <div style={{ display: 'flex', justifyContent: 'center', marginBlock: CssSizes.big }} >
            <div style={{ maxWidth: 800 }} >
                <BlackHoleCanvas2 width={Math.min(width - 20, 800)} points={costCalculatorValue.value ?? 0} />
            </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ maxWidth: ScreenWidths.Mobile, width: '100%' }}>
                <GlassCard flex={1} marginSize="moderate" paddingSize="large">
                    <Stack direction='row' spacing={1} alignItems='center'>
                        <GlassText size="large">Cost Calculator</GlassText>
                        <Select value={costCalculatorValue.size} onChange={e => setInputValue(e.target.value)}>
                            <MenuItem value='GB'>GB</MenuItem>
                            <MenuItem value='TB'>TB</MenuItem>
                        </Select>
                        <TextField
                            type="number"
                            style={{ width: '7em' }}
                            value={costCalculatorValue.value ?? undefined}
                            onChange={e => setInputValue(e.target.value)}
                        />
                    </Stack>
                    <Slider
                        valueLabelDisplay="auto"
                        min={1}
                        max={2 ** 10}
                        value={costCalculatorValue.value ?? 0}
                        onChange={(_, value) => setCostCalculatorValue(old => ({ ...old, value: +(value ?? 0) }))}
                    />
                    {width <= ScreenWidths.Mobile && <Divider style={{ margin: '0.4em' }} />}
                    <GlassText size="large">${initialCost.toFixed(2)} Initial upload cost</GlassText>
                    <Divider style={{ margin: '0.4em' }} />
                    <GlassText size="large">${costValue.toFixed(2)} Per Month</GlassText>
                    {width <= ScreenWidths.Mobile && <Divider style={{ margin: '0.4em' }} />}
                    <GlassText size="moderate">${(costValue * 12).toFixed(2)} Per Year</GlassText>
                </GlassCard>
            </div>
        </div>
    </>
}

export default CostCalculator