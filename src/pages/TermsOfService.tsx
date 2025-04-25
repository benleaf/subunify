import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Stack } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import GlassText from "@/components/glassmorphism/GlassText";

const TermsOfService = () => {
    return <DashboardLayout>
        <GlassSpace size="tiny" style={{ overflowY: 'scroll', height: '83vh' }}>
            <Stack spacing={1} maxWidth={800}>
                <GlassText size="big">SUBUNIFY Terms Of Service</GlassText>
                <GlassText size="large">Terms of Service</GlassText>
                <GlassText size="moderate">
                    These Terms of Service (“Terms”) govern your access to and use of SUBUNIFY LLC (“SUBUNIFY”, “we”, “our”, or “us”), a file archiving platform. By using our website and services, you agree to be bound by these Terms. If you do not agree, you may not use the service.
                </GlassText>

                <GlassText size="large">1. Use of Service</GlassText>
                <GlassText size="moderate">
                    SUBUNIFY allows you to upload, archive, restore, and delete data through a web-based interface. You are responsible for ensuring that any files you store do not violate applicable laws or infringe on the rights of others.
                </GlassText>

                <GlassText size="large">2. Account Registration</GlassText>
                <GlassText size="moderate">
                    To use SUBUNIFY, you must create an account via our login system. You agree to provide accurate and complete information and to keep your login credentials secure. You must be at least 18 years old to use this service.
                </GlassText>

                <GlassText size="large">3. Pricing and Billing</GlassText>
                <GlassText size="moderate">
                    <ul>
                        <li>Storage is billed monthly at a rate of <strong>$1.50 per terabyte (1 TB = 1024 GB)</strong> of data stored. Charges are calculated based on the exact number of bytes stored and are prorated daily.</li>
                        <li>Uploads are subject to a one-time fee of <strong>$6.50 per TB</strong>, with a minimum upload fee of <strong>$0.50</strong> per transaction. This fee covers processing and early-deletion costs associated with long-term archival storage.</li>
                        <li>File restoration is offered at the following rates:
                            <ul>
                                <li><strong>Standard (12-hour):</strong> $0.20 per gigabyte (GB)</li>
                                <li><strong>Economy (48-hour):</strong> $0.02 per GB</li>
                                <li><strong>Restoration retention:</strong> $0.002 per GB per day while files remain in a restorable state</li>
                            </ul>
                        </li>
                        <li>All pricing is disclosed before upload confirmation via a modal. By confirming upload, you agree to these charges.</li>
                        <li>Payments are securely processed via Stripe. You authorize recurring monthly charges based on your current storage usage.</li>
                        <li>If you cancel your subscription, you will receive a final invoice based on your storage usage for the current billing period up to the time of cancellation. This amount is billed after cancellation to ensure accurate, usage-based final charges.</li>
                    </ul>
                </GlassText>


                <GlassText size="large">4. Cancellations and Refunds</GlassText>
                <GlassText size="moderate">
                    You may cancel your subscription at any time. Upon cancellation, all files will be permanently deleted. No refunds are issued for unused storage time or previously charged upload fees.
                </GlassText>

                <GlassText size="large">5. File Handling and Deletion</GlassText>
                <GlassText size="moderate">
                    If your subscription ends or you delete files manually, the associated data is removed from our storage system. You acknowledge that deleted files are not recoverable. If you wish to close your account entirely, including deletion of all personal records, you must request this by emailing <a href="mailto:product@subunify.com">product@subunify.com</a>.
                </GlassText>

                <GlassText size="large">6. Service Availability and Limitations</GlassText>
                <GlassText size="moderate">
                    We aim to provide reliable access to your archived data, but we do not guarantee uninterrupted service. File restorations are subject to processing delays based on tier selection. SUBUNIFY is not responsible for third-party network issues or force majeure events.
                </GlassText>

                <GlassText size="large">7. Prohibited Conduct</GlassText>
                <GlassText size="moderate">
                    You may not:
                    <ul>
                        <li>Use the service to store or transmit illegal, harmful, or infringing content.</li>
                        <li>Attempt to reverse-engineer, hack, or disrupt SUBUNIFY's operations.</li>
                        <li>Impersonate other users or use false identity information.</li>
                    </ul>
                    Violations may result in account termination and data deletion without refund.
                </GlassText>

                <GlassText size="large">8. Intellectual Property</GlassText>
                <GlassText size="moderate">
                    SUBUNIFY retains all rights to its software, branding, and platform infrastructure. You retain ownership of the files you upload, subject to these Terms.
                </GlassText>

                <GlassText size="large">9. Limitation of Liability</GlassText>
                <GlassText size="moderate">
                    To the maximum extent permitted by law, SUBUNIFY is not liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the service. This includes loss of data, even if we were advised of the possibility.
                </GlassText>

                <GlassText size="large">10. Modifications</GlassText>
                <GlassText size="moderate">
                    We may update these Terms from time to time. If we make material changes, we will notify you by email or through the website. Your continued use of SUBUNIFY after updates constitutes your acceptance.
                </GlassText>

                <GlassText size="large">11. Contact</GlassText>
                <GlassText size="moderate">
                    For any questions about these Terms or your account, contact us at <a href="mailto:product@subunify.com">product@subunify.com</a>.
                </GlassText>

            </Stack>
        </GlassSpace>
    </DashboardLayout>
}

export default TermsOfService
