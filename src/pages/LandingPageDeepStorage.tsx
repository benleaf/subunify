import GlassText from "@/components/glassmorphism/GlassText";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { Button, Divider, MenuItem, Select, Slider, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import { ScreenWidths } from "@/constants/ScreenWidths";
import { useState } from "react";
import ExampleTable from "@/components/TablesDataTable/ExampleTable";
import { useSize } from "@/hooks/useSize";
import DynamicStack from "@/components/glassmorphism/DynamicStack";
import BlackHoleCanvas from "@/components/graphics/BlackHoleCanvas";

const LandingPageDeepStorage = () => {
    const { width } = useSize()
    const [costCalculatorValue, setCostCalculatorValue] = useState({ size: 'TB', value: 100 })
    const sizeMultiplier = costCalculatorValue.size == 'TB' ? 1 : 2 ** -10
    const totalGB = costCalculatorValue.value * sizeMultiplier
    const deepStorageCost = 1.5
    const initialStorageCost = 6.5

    const costValue = deepStorageCost * totalGB + 0.6
    const initialCost = Math.max(0.5, initialStorageCost * totalGB)

    return <div>
        {width < ScreenWidths.Mobile && <div style={{ height: '35vh' }} />}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', height: width > ScreenWidths.Mobile ? '95vh' : '20vh', alignItems: 'center', width: '80vh' }}>
                <GlassSpace size='moderate' style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <GlassText size="large" style={{ letterSpacing: '0.15em' }}>THE SUBUNIFY</GlassText>
                        <Divider style={{ flex: 1 }} />
                    </div>
                    <GlassText size="gigantic" style={{ lineHeight: '10vw', fontWeight: 'bolder' }}>DEEP STORE</GlassText>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <GlassText size="moderate" style={{ letterSpacing: '0.15em', fontWeight: 'lighter' }}>BLACK HOLE MEDIA ARCHIVING</GlassText>
                        <Divider style={{ flex: 1 }} />
                    </div>
                    {width <= ScreenWidths.Mobile && <div >
                        <BlackHoleCanvas width={Math.min(width - 70, 600)} />
                    </div>}
                </GlassSpace>
            </div>
            {width > ScreenWidths.Mobile && <>
                <div style={{ display: 'flex', height: '95vh', alignItems: 'center', width: '50%' }}>
                    <BlackHoleCanvas width={width * 0.45} />
                </div>
            </>}
        </div>
        {width < ScreenWidths.Tablet && <div style={{ height: '25vh' }} />}
        <div style={{ flex: 1, padding: '2em' }} />
        <DynamicStack>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <GlassText size="large">Deep Cloud Data storage </GlassText>
                <GlassCard marginSize="small" paddingSize="small" flex={1}>
                    <div style={{ height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <GlassText size="moderate">
                            Data stored on encrypted Amazon servers with data redundancy protecting you from file corruption.
                        </GlassText>
                    </div>
                </GlassCard>
            </div>
            {width < ScreenWidths.Mobile && <div style={{ flex: 1, padding: '2em' }} />}
            <GlassCard marginSize="small" paddingSize="small" flex={1}>
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
            {width < ScreenWidths.Mobile && <div style={{ flex: 1, padding: '2em' }} />}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <GlassText size="large">Pay As You Go</GlassText>
                <GlassCard marginSize="small" paddingSize="small" flex={1}>
                    <div style={{ height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <GlassText size="moderate">
                            Only pay for the data you use, no hidden fees, no cancellation fees no limits on data size.
                        </GlassText>
                    </div>
                </GlassCard>
            </div>
        </DynamicStack>
        {width < ScreenWidths.Mobile && <div style={{ flex: 1, padding: '3em' }} />}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GlassSpace size='moderate'>
                <GlassText size="large" style={{ letterSpacing: '0.15em' }}></GlassText>
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
                    <GlassSpace size={"tiny"} >
                        <GlassText size="large">${initialCost.toFixed(2)} Initial storage cost</GlassText>
                        <Divider style={{ margin: '0.4em' }} />
                        <GlassText size="large">${costValue.toFixed(2)} Per Month (including $0.60 account fee)</GlassText>
                        <GlassText size="moderate">${(costValue * 12).toFixed(2)} Per Year</GlassText>
                    </GlassSpace>
                </GlassCard>
            </div>
        </div>
        {width < ScreenWidths.Mobile && <div style={{ flex: 1, padding: '2em' }} />}

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <GlassSpace size={"large"} style={{ height: '100%', maxWidth: ScreenWidths.Mobile, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <GlassText size="large">STORAGE</GlassText>
                <Stack spacing={3} margin='1em'>
                    <GlassText size="moderate">
                        At SUBUNIFY we believe archiving data should be cheap and easy. That's why we emphasize simplicity of use and low price.
                        At $1.50 per TB per Month with a simple price structure and interface, SUBUNIFY is designed for artists, videographers
                        and business owners who need data storage but don't want a PhD in Computer Science to use it. Simply file and forget.
                    </GlassText>
                    <TableContainer>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Cost of TB per month</TableCell>
                                    <TableCell>Monthly account fee</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow >
                                    <TableCell>$1.50</TableCell>
                                    <TableCell>$0.60</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            </GlassSpace>
            <GlassSpace size={"large"} style={{ height: '100%', maxWidth: ScreenWidths.Mobile, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <GlassText size="large">DOWNLOAD</GlassText>
                <GlassText size="moderate">
                    <Stack spacing={3} margin='1em'>
                        <GlassText size="moderate">
                            The way we achieve our low price is by embracing a key limitation: Retrieval time. We purposefully limit retrieval time to 12 hours,
                            this allows our Amazon servers to optimize storage to unrivaled levels. Our price is only possible because of this.
                        </GlassText>
                        <GlassText size="moderate">
                            Our service is not for day to day use, it is not for file sharing and streaming, it does one thing, and one thing excellently, it archives.
                            If you wish these other things, we recommend other services, but, if you have Terabytes of data that you need to hold for years at a time, we
                            can only recommend ourselves.
                        </GlassText>
                        <GlassText size="moderate">
                            Due to the long restore time, we allow the creation of an access window after file restoration. In this window of time,
                            a file can be downloaded freely and immediately. The length of this window is specified by you.
                        </GlassText>
                        <GlassText size="moderate">
                            File restoration costs are added to the monthly storage costs and billed together monthly.
                        </GlassText>
                    </Stack>
                </GlassText>
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
                    <GlassText size="moderate">
                        SUBUNIFY provides a means of bulk uploading files to the cloud. Uploads to SUBUNIFY are instant
                        with fees, these fees are charged immediately after the the conclusion of a successful bulk upload.
                        If a bulk upload is interrupted for some reason we will only charge for the files that were fully
                        uploaded at the time of the interrupt.
                    </GlassText>
                    <GlassText size="moderate">
                        Deletions from SUBUNIFY are free of charge and can be performed at any time. If a file is deleted mid
                        way through the month it will be charged for the time it was in storage during that month on a pro rata basis.
                    </GlassText>
                    <GlassText size="moderate">
                        Careful, Once a file is deleted it can not be recovered, ensure you have backups of any files you wish to delete
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

        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GlassSpace size='huge' style={{ textAlign: 'center' }}>
                <GlassText size="large">SUBUNIFY</GlassText>
            </GlassSpace>
        </div>
    </div >
}

export default LandingPageDeepStorage