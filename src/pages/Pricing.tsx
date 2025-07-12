import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import GlassText from "@/components/glassmorphism/GlassText";
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
    return <GlassSpace size="tiny" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Stack spacing={1} maxWidth={800}>
            <div id='pricing' />
            <GlassText size="huge">SUBUNIFY Pricing</GlassText>
            <GlassText size="large">Upfront Costs</GlassText>
            <Stack spacing={3} margin='1em'>
                <GlassText size="moderate" color="primaryLight">
                    Subunify is based around the concept of projects, a project is a collection of files that are stored together.
                    Each project has a set amount of storage that can be used to store files, this storage is measured in Terabytes (TB).
                    The owner of a project can add capacity to the project at any time, this is done by purchasing additional storage.
                </GlassText>
                <TableContainer>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Upfront cost of storage</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow >
                                <TableCell>$60.50 per TB</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Stack>
            <div style={{ height: '10vh' }} id='download' />
            <GlassText size="large">File Lifecycle</GlassText>
            <Stack spacing={3} margin='1em'>
                <GlassText size="moderate" color="primaryLight">
                    When a file is uploaded to SUBUNIFY it has a lifecycle.
                </GlassText>
                <GlassText size="moderate" color="primaryLight">
                    Files are initially stored in the <strong>First Month</strong> stage, where they can be downloaded instantly.
                    Compressed versions of the files known as proxies are also stored in this stage.
                </GlassText>
                <GlassText size="moderate" color="primaryLight">
                    After the first month, files are moved to the <strong>After First Month</strong> stage, in this stage files are stored in a more cost-effective manner.
                    The proxies are removed, and the files can only be downloaded after a 12-hour retrieval time.
                </GlassText>
                <GlassText size="moderate" color="primaryLight">
                    Previews of files are always available, regardless of the stage they are in.
                </GlassText>
            </Stack>
            <TableContainer>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Stage</TableCell>
                            <TableCell>Retrieval Time</TableCell>
                            <TableCell>Cost (per TB)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow >
                            <TableCell>First Month</TableCell>
                            <TableCell>Instant</TableCell>
                            <TableCell>$60.50 (one time)</TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell>After First Month</TableCell>
                            <TableCell>12 Hour</TableCell>
                            <TableCell>$1.99 (per month)</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ height: '10vh' }} id='questions' />

            <GlassText size="large">Questions?</GlassText>
            <GlassText size="moderate">
                Contact us at <a href="mailto:product@subunify.com">product@subunify.com</a> if you need help interpreting charges.
            </GlassText>
        </Stack>
    </GlassSpace>
}

export default TermsOfService
