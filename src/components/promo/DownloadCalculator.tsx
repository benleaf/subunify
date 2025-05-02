import { ScreenWidths } from "@/constants/ScreenWidths"
import { useSize } from "@/hooks/useSize"
import { Stack, Select, MenuItem } from "@mui/material"
import GlassCard from "../glassmorphism/GlassCard"
import GlassText from "../glassmorphism/GlassText"
import { useState } from "react"
import { retrievalTypeInfo } from "@/constants/RetrievalTypes"

const DownloadCalculator = () => {
    const [retrievalType, setRetrievalType] = useState<keyof typeof retrievalTypeInfo>('Standard')
    const { cost } = retrievalTypeInfo[retrievalType]

    const setInputValue = (value: string) => {
        setRetrievalType(value as keyof typeof retrievalTypeInfo)
    }

    return <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ maxWidth: ScreenWidths.Mobile, width: '100%' }}>
                <GlassCard flex={1} marginSize="moderate" paddingSize="large">
                    <GlassText size="large">Downloading 1 GB worth of files at</GlassText>
                    <Select value={retrievalType} onChange={e => setInputValue(e.target.value)}>
                        {Object.keys(retrievalTypeInfo).map(option =>
                            <MenuItem value={option} key={option}>
                                {retrievalTypeInfo[option as keyof typeof retrievalTypeInfo].name}
                            </MenuItem>
                        )}
                    </Select>
                    <GlassText size="large">will cost <b>${cost.toFixed(2)}</b></GlassText>
                </GlassCard>
            </div>
        </div>
    </>
}

export default DownloadCalculator