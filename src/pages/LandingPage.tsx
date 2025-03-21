import GlassText from "@/components/glassmorphism/GlassText";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { Button, Divider, Stack } from "@mui/material";
import FloatingGlassCircle from "@/components/glassmorphism/FloatingGlassCircle";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import DynamicStack from "@/components/glassmorphism/DynamicStack";
import GlassIconText from "@/components/glassmorphism/GlassIconText";
import { Article, Backup, BallotOutlined, BorderTop, CreateNewFolder, Dashboard, PieChart } from "@mui/icons-material";
import ExampleTable from "@/components/TablesDataTable/ExampleTable";
import { ScreenWidths } from "@/constants/ScreenWidths";
import { BarChart } from "@mui/x-charts";
import { useSize } from "@/hooks/useSize";

const LandingPage = () => {
    const { width } = useSize()
    return <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GlassSpace size='moderate'>
                <GlassText size="gigantic" style={{ letterSpacing: '0.15em' }}>UNIFY YOUR RECORDS...</GlassText>
            </GlassSpace>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <DynamicStack>
                <FloatingGlassCircle offset={{ bottom: '-10em', left: '-4em' }} size="medium" />
                <GlassCard marginSize="small">
                    <div style={{ maxWidth: 400, height: 500, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <GlassSpace size={"tiny"} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <GlassText size="large">START FROM EXCEL:</GlassText>
                            <GlassText size="moderate">
                                <Stack spacing={3} margin='1em'>
                                    <GlassIconText size={"moderate"} icon={<Article color="primary" fontSize="medium" />}>
                                        Use any excel file that you want to collect data from
                                    </GlassIconText>
                                    <GlassIconText size={"moderate"} icon={<BorderTop color="primary" fontSize="medium" />}>
                                        Select your tables header and records
                                    </GlassIconText>
                                    <GlassIconText size={"moderate"} icon={<Backup color="primary" fontSize="medium" />}>
                                        Deploy to a secure cloud server
                                    </GlassIconText>
                                    <GlassIconText size={"moderate"} icon={<BallotOutlined color="primary" fontSize="medium" />}>
                                        Enjoy painless data access using the power of web forms
                                    </GlassIconText>
                                </Stack>
                            </GlassText>
                            <Button startIcon={<CreateNewFolder />} href="/excel-importer" variant="contained" style={{ color: 'white' }}>Create From Excel</Button>
                        </GlassSpace>
                    </div>
                </GlassCard>
                <Divider orientation="vertical" flexItem><GlassText size="moderate">OR</GlassText></Divider>
                <GlassCard marginSize="small">
                    <div style={{ maxWidth: 400, height: 500, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <GlassSpace size={"tiny"} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <GlassText size="large">START FROM SCRATCH:</GlassText><GlassText size="moderate">
                                <Stack spacing={3} margin='1em'>
                                    <GlassIconText size={"moderate"} icon={<BallotOutlined color="primary" fontSize="medium" />}>
                                        Start with a blank slate and add data manually
                                    </GlassIconText>
                                    <GlassIconText size={"moderate"} icon={<Backup color="primary" fontSize="medium" />}>
                                        Add tables from Excel at any point
                                    </GlassIconText>
                                    <GlassIconText size={"moderate"} icon={<PieChart color="primary" fontSize="medium" />}>
                                        Start right and structure your data how you want
                                    </GlassIconText>
                                </Stack>
                            </GlassText>
                            <Button startIcon={<Dashboard />} href="/dashboard" variant="contained" style={{ color: 'white' }}>Create Dashboard</Button>
                        </GlassSpace>
                    </div>
                </GlassCard>
                <FloatingGlassCircle offset={{ top: '-2em', right: '-2em' }} size="small" />
            </DynamicStack >
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GlassSpace size='moderate'>
                <GlassText size="large" style={{ letterSpacing: '0.15em' }}>MAINTAIN DATA LIKE A PRO</GlassText>
                <GlassText size="moderate">Store records in custom tables, created and designed by you</GlassText>
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
                <GlassText size="large" style={{ letterSpacing: '0.15em' }}>CREATE RESPONSIVE CHARTS</GlassText>
                <GlassText size="moderate">Create charts that update automatically with your records</GlassText>
            </GlassSpace>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ maxWidth: ScreenWidths.Mobile, width: '100%' }}>
                <GlassCard flex={1} marginSize="moderate" >
                    <BarChart
                        layout="horizontal"
                        grid={{ vertical: true }}
                        margin={{ left: 100 }}
                        yAxis={[{
                            data: ['In review', 'Pending', 'Paused', 'Unsubscribed', 'Subscribed'],
                            scaleType: 'band',
                        }]}
                        series={[{ data: [12, 37, 98, 260, 530] }]}
                        width={Math.min(ScreenWidths.Mobile, width) - 30}
                        height={400}
                    />
                </GlassCard>
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GlassSpace size='moderate'>
                <GlassText size="large" style={{ letterSpacing: '0.15em' }}>CONTACT US</GlassText>
                <GlassText size="moderate">product@subunify.com</GlassText>
            </GlassSpace>
        </div>
    </div >
}

export default LandingPage