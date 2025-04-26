import GlassText from "@/components/glassmorphism/GlassText";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import { ScreenWidths } from "@/constants/ScreenWidths";
import ExampleTable from "@/components/TablesDataTable/ExampleTable";
import FirstLineMessaging from "@/components/promo/FirstLineMessaging";
import CostCalculator from "@/components/promo/CostCalculator";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import OpeningSplash from "@/components/promo/OpeningSplash";
import ImageSplash from "@/components/promo/ImageSplash";

gsap.registerPlugin(ScrollTrigger);

const LandingPageDeepStorage = () => {
    return <div>
        <OpeningSplash />
        <FirstLineMessaging />
        <div style={{ height: '10vh' }} />
        <ImageSplash />
        <div style={{ height: '10vh' }} />

        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GlassSpace size='moderate'>
                <GlassText size="large" style={{ letterSpacing: '0.15em' }}>Get started today!</GlassText>
                <Button fullWidth variant="contained" href="/file-upload">
                    Archive A File
                </Button>
            </GlassSpace>
        </div>

        <CostCalculator />
        <div style={{ height: '10vh' }} />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <GlassSpace size="large" style={{ height: '100%', maxWidth: ScreenWidths.Mobile, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <GlassText size="large">STORAGE</GlassText>
                <Stack spacing={3} margin='1em'>
                    <GlassText size="moderate" color="primaryLight">
                        Not all files are made equal, some are in active use, used day in and day out, shard with the world. But others
                        see little of this. Some files may lay dormant for years before needing use. These files can't be deleted but equally are not yet needed.
                        At SUBUNIFY, we asked a simple question: Why do we store all files in the same place at the same price?
                    </GlassText>
                    <GlassText size="moderate" color="primaryLight">
                        We created the deep file store for this reason. The store is a home for these unneeded files where they can sit in status for
                        years at a time. Specially designed to take advantage of limited usage and leveraging this to offer archival prices.
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
                    <GlassText size="moderate" color="primaryLight">
                        Our service is not for day-to-day use, it is not for file sharing and streaming, it does one thing, and one thing excellently, it archives.
                        If you wish these other things, we recommend other services, but, if you have Terabytes of data that you need to hold for years at a time, we
                        can only recommend ourselves.
                    </GlassText>
                    <GlassText size="moderate" color="primaryLight">
                        Due to the long restore time, we allow the creation of an access window after file restoration. In this window of time,
                        a file can be downloaded freely and immediately. The length of this window is specified by you.
                    </GlassText>
                    <GlassText size="moderate" color="primaryLight">
                        File restoration costs are added to the monthly storage costs and billed together monthly.
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
                <GlassText size="large">UPLOAD AND DELETION</GlassText>
                <Stack spacing={3} margin='1em'>
                    <GlassText size="moderate" color="primaryLight">
                        SUBUNIFY provides a means of bulk uploading files to the cloud. Uploads to SUBUNIFY are instant
                        with fees, these fees are charged immediately after the conclusion of a successful bulk upload.
                        If a bulk upload is interrupted for some reason, we will only charge for the files that were fully
                        uploaded at the time of the interrupt.
                    </GlassText>
                    <GlassText size="moderate" color="primaryLight">
                        Deletions from SUBUNIFY are free of charge and can be performed at any time. If a file is deleted mid-way
                        through the month, it will be charged for the time it was in storage during that month on a pro rata basis.
                    </GlassText>
                    <GlassText size="moderate" color="primaryLight">
                        Careful, once a file is deleted it cannot be recovered, ensure you have backups of any files you wish to delete
                        or are certain that they are no longer needed.
                    </GlassText>
                    <TableContainer>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Cost of TB Upload</TableCell>
                                    <TableCell>Cost of TB Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow >
                                    <TableCell>$6.50 (Minimum of $0.50)</TableCell>
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

export default LandingPageDeepStorage