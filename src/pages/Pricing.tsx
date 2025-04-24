import DashboardLayout from "@/components/DashboardLayout";
import { Stack } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import GlassText from "@/components/glassmorphism/GlassText";

const TermsOfService = () => {
    return <DashboardLayout>
        <GlassSpace size="tiny" style={{ overflowY: 'scroll', height: '83vh' }}>
            <Stack spacing={1}>
                <GlassText size="large">Pricing</GlassText>
                <GlassText size="moderate">
                    Subunify offers affordable, long-term file archiving using secure cold storage. Below is a detailed breakdown of pricing to help you make informed decisions before uploading your data.
                </GlassText>

                <GlassText size="large">Important Note on Units</GlassText>
                <GlassText size="moderate">
                    Subunify uses the binary definition for data storage:
                    <ul>
                        <li><strong>1 terabyte (TB) = 1024 gigabytes (GB)</strong></li>
                        <li>This matches our internal measurement standards and ensures precise billing for technical users</li>
                    </ul>
                </GlassText>

                <GlassText size="large">Monthly Storage</GlassText>
                <GlassText size="moderate">
                    <ul>
                        <li><strong>$1.50 per TB (1024 GB) per month</strong></li>
                        <li>Storage is metered daily and billed proportionally</li>
                        <li>Example: 512GB stored for a month = $0.75</li>
                    </ul>
                </GlassText>

                <GlassText size="large">Upload Fee</GlassText>
                <GlassText size="moderate">
                    <ul>
                        <li><strong>$6.50 per TB uploaded</strong></li>
                        <li><strong>Minimum upload fee:</strong> $0.50</li>
                        <li>This one-time fee includes processing and early-deletion overheads</li>
                    </ul>
                </GlassText>

                <GlassText size="large">Restore Pricing</GlassText>
                <GlassText size="moderate">
                    <ul>
                        <li><strong>Standard (12-hour):</strong> $0.20 per GB restored</li>
                        <li><strong>Economy (48-hour):</strong> $0.02 per GB restored</li>
                        <li><strong>Retention while restored:</strong> $0.002 per GB per day</li>
                    </ul>
                </GlassText>

                <GlassText size="large">Cancellations</GlassText>
                <GlassText size="moderate">
                    <ul>
                        <li>Files are deleted immediately upon cancellation</li>
                        <li>A final invoice will be issued based on prorated storage used (in TB) during the current billing cycle</li>
                    </ul>
                </GlassText>

                <GlassText size="large">No Hidden Fees</GlassText>
                <GlassText size="moderate">
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
