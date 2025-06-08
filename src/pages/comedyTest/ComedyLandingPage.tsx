import GlassText from "@/components/glassmorphism/GlassText";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { Button, ButtonBase, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import { ScreenWidths } from "@/constants/ScreenWidths";
import ExampleTable from "@/components/TablesDataTable/ExampleTable";
import CostCalculator from "@/components/promo/CostCalculator";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import OpeningSplash from "@/components/promo/OpeningSplash";
import WhatWeAreFor from "@/components/promo/WhatWeAreFor";
import FirstLineMessaging from "@/components/promo/FirstLineMessaging";
import NextDayDelivery from "@/components/promo/NextDayDelivery";
import PricingCarousel from "@/components/promo/PricingCarousel";
import DownloadCalculator from "@/components/promo/DownloadCalculator";
import { useAuth } from "@/contexts/AuthContext";

gsap.registerPlugin(ScrollTrigger);

const ComedyLandingPage = () => {
    const { user } = useAuth()
    return <div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1em', position: 'fixed' }}>
            <ButtonBase href={user?.email_verified ? "/dashboard" : '/'}>
                <GlassText size="big">SUBUNIFY</GlassText>
                <GlassText size="small">beta</GlassText>
            </ButtonBase>
            <Stack direction='row' spacing={1} alignItems='center'>
                <Button href="/dashboard" >
                    Login
                </Button>
            </Stack>
        </div>
        <OpeningSplash />
        {/* <div style={{ height: '20vh' }} />
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
        <div style={{ height: '10vh' }} />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <GlassSpace size="large" style={{ height: '100%', maxWidth: ScreenWidths.Mobile, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <GlassText size="large">STORAGE</GlassText>
                <Stack spacing={3} margin='1em'>
                    <GlassText size="moderate" color="primaryLight">
                        At $1.50 per TB per Month with a clean price structure and interface, SUBUNIFY is designed for artists, videographers
                        and business owners who need data storage but not the data (yet).
                    </GlassText>
                    <TableContainer>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Cost of TB per month</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow >
                                    <TableCell>$1.50 ($0.60 minimum payment)</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            </GlassSpace>
            <GlassSpace size={"large"} style={{ height: '100%', maxWidth: ScreenWidths.Mobile, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <GlassText size="large">DOWNLOAD</GlassText>
                <Stack spacing={3} margin='1em'>
                    <GlassText size="moderate" color="primaryLight">
                        The way we achieve our low price is by embracing a key trade off: Retrieval time. We purposefully limit retrieval time to 12 hours,
                        this allows our Amazon servers to optimize storage to unrivalled levels. Our price is made possible because of this.
                    </GlassText>
                </Stack>
                <TableContainer>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Restore Time</TableCell>
                                <TableCell>Cost of restore per GB</TableCell>
                                <TableCell>Cost of Access window per Day per GB</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow >
                                <TableCell>Standard</TableCell>
                                <TableCell>12 Hour</TableCell>
                                <TableCell>$0.20</TableCell>
                                <TableCell>$0.002</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell>Economy</TableCell>
                                <TableCell>48 Hour</TableCell>
                                <TableCell>$0.02</TableCell>
                                <TableCell>$0.002</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </GlassSpace>
            <GlassSpace size={"large"} style={{ height: '100%', maxWidth: ScreenWidths.Mobile, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <GlassText size="large">UPLOAD</GlassText>
                <Stack spacing={3} margin='1em'>
                    <GlassText size="moderate" color="primaryLight">
                        SUBUNIFY provides a means of bulk uploading files to the cloud. Uploads to SUBUNIFY are instant
                        with fees, these fees are charged immediately after the conclusion of a successful bulk upload.
                    </GlassText>
                    <TableContainer>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Cost of TB Upload</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow >
                                    <TableCell>$6.50 (Minimum of $0.50)</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            </GlassSpace>
            <GlassSpace size={"large"} style={{ height: '100%', maxWidth: ScreenWidths.Mobile, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <GlassText size="large">DELETION</GlassText>
                <Stack spacing={3} margin='1em'>
                    <GlassText size="moderate" color="primaryLight">
                        Deletions from SUBUNIFY are free of charge and can be performed at any time. If a file is deleted mid-way
                        through the month, it will be charged for the time it was in storage during that month on a pro rata basis.
                    </GlassText>
                    <TableContainer>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Cost of TB Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow >
                                    <TableCell>Free</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            </GlassSpace>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GlassSpace size='moderate'>
                <GlassText size="large" style={{ letterSpacing: '0.15em' }}>Get started today!</GlassText>
                <Button fullWidth variant="contained" href="/file-upload">
                    Archive A File
                </Button>
            </GlassSpace>
        </div> */}

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