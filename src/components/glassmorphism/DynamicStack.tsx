import { ReactNode } from "react"
import { useSize } from "@/hooks/useSize"
import { ScreenWidths } from "@/constants/ScreenWidths"
import { Stack } from "@mui/material"

type Props = {
    children: ReactNode
}

const DynamicStack = ({ children }: Props) => {
    const { width } = useSize()
    return <Stack direction={width > ScreenWidths.Mobile ? 'row' : 'column'} >
        {children}
    </Stack>
}

export default DynamicStack