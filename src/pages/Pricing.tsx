import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import GlassText from "@/components/glassmorphism/GlassText";
import { ScreenWidths } from "@/constants/ScreenWidths";
import { useLocation } from "react-router";
import { useEffect } from "react";

const TermsOfService = () => {
    const location = useLocation()

    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }, [location.hash])
    return <DashboardLayout>
        <GlassSpace size="tiny" style={{ overflowY: 'scroll', height: '83vh' }}>
            <Stack spacing={1} maxWidth={800}>
                <div id='pricing' />
                <GlassText size="large">Pricing</GlassText>
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
                <div style={{ height: '10vh' }} id='download' />
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
                                <TableCell>Retrieval Time</TableCell>
                                <TableCell>Cost of retrieval per GB</TableCell>
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
                <div style={{ height: '10vh' }} id='upload' />
                <GlassText size="large">UPLOAD</GlassText>
                <Stack spacing={3} margin='1em'>
                    <GlassText size="moderate" color="primaryLight">
                        SUBUNIFY provides a means of bulk uploading files to the cloud. Uploads to SUBUNIFY are instant
                        with fees, these fees are charged immediately after the conclusion of a successful bulk upload.
                        If a bulk upload is interrupted for some reason, we will only charge for the files that were fully
                        uploaded at the time of the interrupt.
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
                <div style={{ height: '10vh' }} id='delete' />
                <GlassText size="large">DELETION</GlassText>
                <Stack spacing={3} margin='1em'>
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
                <div style={{ height: '10vh' }} />

                <GlassText size="large">Important Note on Units</GlassText>
                <GlassText size="moderate" color="primaryLight">
                    Subunify uses the binary definition for data storage:
                    <ul>
                        <li><strong>1 terabyte (TB) = 1024 gigabytes (GB)</strong></li>
                        <li>This matches our internal measurement standards and ensures precise billing for technical users</li>
                    </ul>
                </GlassText>

                <GlassText size="large">Cancellations</GlassText>
                <GlassText size="moderate" color="primaryLight">
                    <ul>
                        <li>Files are deleted immediately upon cancellation</li>
                        <li>A final invoice will be issued based on prorated storage used (in TB) during the current billing cycle</li>
                    </ul>
                </GlassText>

                <GlassText size="large">No Hidden Fees</GlassText>
                <GlassText size="moderate" color="primaryLight">
                    <ul>
                        <li>No charge for deletion or cancellation</li>
                        <li>All pricing is shown before uploads are processed</li>
                        <li>Taxes may apply depending on your region</li>
                    </ul>
                </GlassText>

                <GlassText size="large">Questions?</GlassText>
                <GlassText size="moderate">
                    Contact us at <a href="mailto:product@subunify.com">product@subunify.com</a> if you need help interpreting charges.
                </GlassText>
            </Stack>
        </GlassSpace>
    </DashboardLayout>
}

export default TermsOfService
