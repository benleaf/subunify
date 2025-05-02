import GlassText from "@/components/glassmorphism/GlassText";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import { ScreenWidths } from "@/constants/ScreenWidths";
import ExampleTable from "@/components/TablesDataTable/ExampleTable";
import CostCalculator from "@/components/promo/CostCalculator";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ComedyOpeningSplash from "@/components/promo/ComedyOpeningSplash";
import WhatWeAreFor from "@/components/promo/WhatWeAreFor";
import FirstLineMessaging from "@/components/promo/FirstLineMessaging";
import NextDayDelivery from "@/components/promo/NextDayDelivery";
import PricingCarousel from "@/components/promo/PricingCarousel";
import DownloadCalculator from "@/components/promo/DownloadCalculator";

gsap.registerPlugin(ScrollTrigger);

const ComedyLandingPage = () => {
    return <div>
        <ComedyOpeningSplash />
        <WhatWeAreFor />
        <div style={{ height: '20vh' }} />
        <FirstLineMessaging />
        <div style={{ height: '5vh' }} />
        <NextDayDelivery />
        <div style={{ height: '5vh' }} />
        <PricingCarousel />
        <div style={{ height: '10vh' }} />
        <CostCalculator />
        <DownloadCalculator />
        <div style={{ height: '10vh' }} />

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
                <GlassText size="large" style={{ letterSpacing: '0.15em' }}>Get started today!</GlassText>
                <Button fullWidth variant="contained" href="/file-upload">
                    Archive A File
                </Button>
            </GlassSpace>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GlassSpace size='moderate'>
                <GlassText size="large" style={{ letterSpacing: '0.15em' }}>CONTACT US</GlassText>
                <GlassText size="moderate">product@subunify.com</GlassText>
            </GlassSpace>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '3em' }}>
            <Button href='/privacy-policy'>Privacy Policy</Button>
            <Button href='/terms-of-service'>Terms Of Service</Button>
            <Button href='/pricing'>Pricing</Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GlassSpace size='big' style={{ textAlign: 'center' }}>
                <GlassText size="large">SUBUNIFY</GlassText>
            </GlassSpace>
        </div>
    </div >
}

export default ComedyLandingPage