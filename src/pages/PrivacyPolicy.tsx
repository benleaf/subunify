import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Stack } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import GlassText from "@/components/glassmorphism/GlassText";

const PrivacyPolicy = () => {
    return <DashboardLayout >
        <GlassSpace size="tiny" style={{ overflowY: 'scroll', height: '83vh' }}>
            <Stack spacing={1} maxWidth={800}>
                <GlassText size="huge">SUBUNIFY Privacy Policy</GlassText>
                <GlassText size="moderate">
                    Effective Date: 04/24/2025
                </GlassText>
                <GlassText size="moderate">
                    SUBUNIFY LLC (“SUBUNIFY”, “we”, “our”, or “us”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your personal information when you access or use our services through our website.
                </GlassText>

                <GlassText size="large">1. Information We Collect</GlassText>
                <GlassText size="moderate">
                    When you use SUBUNIFY, we may collect the following information:
                    <ul>
                        <li><strong>Account Information:</strong> Your email address and authentication identifiers when you sign up or log in.</li>
                        <li><strong>Billing Information:</strong> Collected and processed securely by our third-party payment provider, Stripe.</li>
                        <li><strong>File and Usage Data:</strong> Metadata related to files you upload, your storage usage, and restoration activity.</li>
                        <li><strong>Analytics and Technical Data:</strong> Your device type, browser, visit duration, and usage patterns through third-party analytics services.</li>
                    </ul>
                </GlassText>

                <GlassText size="large">2. How We Use Your Information</GlassText>
                <GlassText size="moderate">
                    We use the information we collect to:
                    <ul>
                        <li>Provide, operate, and maintain our services.</li>
                        <li>Process your payments and manage your subscriptions.</li>
                        <li>Calculate usage-based charges and generate billing statements.</li>
                        <li>Respond to inquiries and provide customer support.</li>
                        <li>Monitor usage trends and improve our website through analytics.</li>
                    </ul>
                </GlassText>

                <GlassText size="large">3. Third-Party Services</GlassText>
                <GlassText size="moderate">
                    We rely on the following third-party services to operate SUBUNIFY:
                    <ul>
                        <li><strong>Stripe:</strong> For secure payment processing and subscription management.</li>
                        <li><strong>Hotjar:</strong> For anonymous analytics, such as heatmaps and usage recordings. You can opt out of Hotjar tracking by visiting <a href="https://www.hotjar.com/policies/do-not-track/" target="_blank" rel="noopener noreferrer">https://www.hotjar.com/policies/do-not-track/</a>.</li>
                    </ul>
                    These providers process your data only as necessary to perform services on our behalf and are contractually obligated to protect your data.
                </GlassText>

                <GlassText size="large">4. Data Retention and Deletion</GlassText>
                <GlassText size="moderate">
                    <ul>
                        <li>If you cancel your subscription, your stored files and associated metadata will be deleted promptly.</li>
                        <li>Your account data will be removed from our system, except where retention is required for billing or legal purposes (e.g., payment history via Stripe).</li>
                        <li>To request full account deletion, including any residual data, please contact us at <a href="mailto:product@subunify.com">product@subunify.com</a>.</li>
                    </ul>
                </GlassText>

                <GlassText size="large">5. Security</GlassText>
                <GlassText size="moderate">
                    We take the security of your information seriously. All data transmissions are protected by HTTPS encryption. File access is restricted and subject to security measures that prevent unauthorized retrieval or modification.
                </GlassText>

                <GlassText size="large">6. Your Rights</GlassText>
                <GlassText size="moderate">
                    Depending on your location, you may have the right to:
                    <ul>
                        <li>Access the personal information we hold about you.</li>
                        <li>Request correction or deletion of your information.</li>
                        <li>Withdraw consent where applicable.</li>
                    </ul>
                    To exercise these rights, contact us at <a href="mailto:product@subunify.com">product@subunify.com</a>.
                </GlassText>

                <GlassText size="large">7. Children’s Privacy</GlassText>
                <GlassText size="moderate">
                    Our services are not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children.
                </GlassText>

                <GlassText size="large">8. Changes to This Policy</GlassText>
                <GlassText size="moderate">
                    We may update this Privacy Policy from time to time. The most current version will always be available on our website. Your continued use of the service after any changes signifies your acceptance of the updated policy.
                </GlassText>

                <GlassText size="large">9. Contact Us</GlassText>
                <GlassText size="moderate">
                    If you have questions or concerns about this Privacy Policy or your data, please contact us at <a href="mailto:product@subunify.com">product@subunify.com</a>.
                </GlassText>
            </Stack>
        </GlassSpace>
    </DashboardLayout>
}

export default PrivacyPolicy
