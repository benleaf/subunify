import { ScreenWidths } from "@/constants/ScreenWidths"
import { Divider, Button, Stack } from "@mui/material"
import GlassCard from "../glassmorphism/GlassCard"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useSize } from "@/hooks/useSize"
import { CssSizes } from "@/constants/CssSizes"
import { Folder, ShoppingCartCheckoutSharp } from "@mui/icons-material"
import GlassIconText from "../glassmorphism/GlassIconText"

const PayAsYouGoTitle = () => <GlassIconText size={"huge"} icon={<ShoppingCartCheckoutSharp style={{ fontSize: '2rem' }} color="primary" />}>
    Pay As You Go
</GlassIconText>

const PayAsYouGoText = () => <GlassText size="moderate">
    Only pay for the data you use, no hidden fees, no cancellation fees no limits on data size.
</GlassText>

const FileAndForgetTitle = () => <GlassIconText size={"huge"} icon={<Folder style={{ fontSize: '2rem' }} color="primary" />}>
    File And Forget
</GlassIconText>

const FileAndForgetText = () => <GlassText size="moderate">
    Data stored on encrypted Amazon servers with data redundancy protecting you from file corruption.
</GlassText>

const CoreMessage = () => <GlassCard marginSize="small" paddingSize="small" flex={1}>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: "100%", textAlign: 'center' }}>
        <GlassSpace size={"moderate"} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
            <GlassText size="large">
                12 Hour File Extraction
            </GlassText>
            <Divider orientation="horizontal" flexItem><GlassText size="small">ENABLES</GlassText></Divider>
            <GlassText size="huge">
                $1.50 per TB per Month
            </GlassText>
        </GlassSpace>
        <Button variant="contained" href="/file-upload">
            Archive A File
        </Button>
    </div>
</GlassCard>

const Desktop = () => {
    return <Stack direction="row" spacing={2} style={{ width: '100%', height: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <PayAsYouGoTitle />
            <GlassCard marginSize="small" paddingSize="small" flex={1}>
                <div style={{ height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <PayAsYouGoText />
                </div>
            </GlassCard>
        </div>
        <CoreMessage />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <FileAndForgetTitle />
            <GlassCard marginSize="small" paddingSize="small" flex={1}>
                <div style={{ height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <FileAndForgetText />
                </div>
            </GlassCard>
        </div>
    </Stack>
}

const Mobile = () => {
    return <Stack direction="column" spacing={2} style={{ width: '100%', height: '100%' }}>
        <CoreMessage />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <GlassCard marginSize="small" paddingSize="small" flex={1}>
                <PayAsYouGoTitle />
                <Divider orientation="horizontal" style={{ marginBlock: CssSizes.moderate }}></Divider>
                <div style={{ height: "100%", display: 'flex' }}>
                    <PayAsYouGoText />
                </div>
            </GlassCard>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <GlassCard marginSize="small" paddingSize="small" flex={1}>
                <FileAndForgetTitle />
                <Divider orientation="horizontal" style={{ marginBlock: CssSizes.moderate }}></Divider>
                <div style={{ height: "100%", display: 'flex' }}>
                    <FileAndForgetText />
                </div>
            </GlassCard>
        </div>
    </Stack>
}


const FirstLineMessaging = () => {
    const { width } = useSize()
    return width <= ScreenWidths.Mobile ? <Mobile /> : <Desktop />
}

export default FirstLineMessaging