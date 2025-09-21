import ColorGlassCard from "@/components/glassmorphism/ColorGlassCard"
import GlassText from "@/components/glassmorphism/GlassText"
import { CssSizes } from "@/constants/CssSizes"
import { useAction } from "@/contexts/actions/infrastructure/ActionContext"
import { useDashboard } from "@/contexts/DashboardContext"
import { Time } from "@/helpers/Time"
import { PaymentResult } from "@/types/server/PaymentResult"
import { ArrowCircleLeft, Info, People } from "@mui/icons-material"
import { Stack, IconButton, Chip, Divider } from "@mui/material"
import { useEffect, useState } from "react"

const Billing = () => {
    const [payments, setPayments] = useState<PaymentResult[]>()
    const { getUserPayments } = useAction()
    const { properties, updateProperties } = useDashboard()

    const fulfilledPayments = payments?.filter(payment => payment.fulfilled) ?? []
    const totalAddedTBs = fulfilledPayments?.reduce((total, payment) => total + payment.terabytes, 0) ?? 0
    const currentSubscription = totalAddedTBs * 1.99

    useEffect(() => { getUserPayments().then(setPayments) }, [])


    return <Stack spacing={1}>
        <Stack spacing={1} height='100%'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => updateProperties({ page: 'projects' })} size="large">
                        <ArrowCircleLeft fontSize="large" />
                    </IconButton>
                    <GlassText size="large">Billing and Payments</GlassText>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                        <GlassText size="big">{totalAddedTBs} TB</GlassText>
                        <GlassText size="moderate">Active</GlassText>
                    </div>
                    <Divider orientation="vertical" style={{ height: 50, marginInline: CssSizes.tiny }} />
                    <div>
                        <GlassText size="big">${currentSubscription}</GlassText>
                        <GlassText size="moderate">Monthly Bill (pre tax)</GlassText>
                    </div>
                </div>
            </div>
            <Stack spacing={1}>
                {payments?.map(payment => <ColorGlassCard paddingSize="small">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                            <GlassText size="large">{payment.project.name}</GlassText>
                            <GlassText size="moderate">{Time.formatDate(payment.created)}</GlassText>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ width: 80, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                <GlassText size="moderate">{payment.fulfilled ? 'Action fulfilled' : 'pending'}</GlassText>
                            </div>
                            <Divider orientation="vertical" style={{ height: 50 }} />
                            {payment.terabytes >= 0 && <div style={{ width: 80, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                <GlassText size="big">{payment.terabytes} TB</GlassText>
                                <GlassText size="moderate">Added</GlassText>
                            </div>}
                            <Divider orientation="vertical" style={{ height: 50 }} />
                            {payment.terabytes < 0 && <div style={{ width: 80, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                <GlassText size="big">{-payment.terabytes} TB</GlassText>
                                <GlassText size="moderate">Removed</GlassText>
                            </div>}
                            <Divider orientation="vertical" style={{ height: 50 }} />
                            {payment.terabytes >= 0 && <div style={{ width: 120, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                <GlassText size="big">${(payment.amount / 100)}</GlassText>
                                <GlassText size="moderate">Paid (pre tax)</GlassText>
                            </div>}
                        </div>
                    </div>
                </ColorGlassCard>)}
            </Stack>
        </Stack>
    </Stack>
}

export default Billing