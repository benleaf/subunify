import { useEffect, useState } from "react";
import { Button, Divider, Stack, TextField } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import GlassText from "@/components/glassmorphism/GlassText";
import { useDashboard } from "@/contexts/DashboardContext";
import GlassCard from "@/components/glassmorphism/GlassCard";
import DynamicStack from "@/components/glassmorphism/DynamicStack";
import PaymentModal from "@/components/modal/PaymentModal";
import { ProjectResult } from "@/types/server/ProjectResult";
import { isError } from "@/api/isError";
import { useAuth } from "@/contexts/AuthContext";
import Stripe from "stripe";
import BaseModal from "@/components/modal/BaseModal";
import ColorGlassCard from "@/components/glassmorphism/ColorGlassCard";
import ProjectSummarySubpage from "@/components/widgets/ProjectSummarySubpage";

const priceBreakdown = [
    { message: '1 Month express upload', value: 35.55 },
    { message: 'Automatic Proxy generation', value: 19.96 },
    { message: '1TB of archival restorations', value: 12.99 },
]

const AddStorage = () => {
    const { authAction, user, setAlert } = useAuth()
    const { properties, updateProperties } = useDashboard()
    const [tbsToAdd, setTbsToAdd] = useState<number>()
    const [paymentModalState, setPaymentModalState] = useState(false)
    const [project, setProject] = useState<ProjectResult>()
    const [quote, setQuote] = useState<{ fee: Stripe.Quote, subscription: Stripe.Quote }>()

    const getProject = async (projectId: string) => {
        const projectResult = await authAction<ProjectResult>(`project/user-project/${projectId}`, 'GET')
        if (!isError(projectResult)) {
            setProject(projectResult)
        }
    }

    const getQuote = async () => {
        const quote = await authAction<{ fee: Stripe.Quote, subscription: Stripe.Quote }>(`stripe/quote`, 'GET')
        console.log(quote)
        if (!isError(quote)) setQuote(quote)
    }

    const payForStorage = async () => {
        if (!tbsToAdd || tbsToAdd < 1) {
            setAlert('You must add at least 1 TB of storage.', 'error')
            return
        }

        const result = await authAction<void>(`stripe/pay-for-terabytes/${properties.selectedProjectId!}/${tbsToAdd}`, 'GET')
        if (!isError(result)) {
            updateProperties({ page: 'project' })
        }
    }

    useEffect(() => {
        getProject(properties.selectedProjectId!)
        getQuote()
    }, [])

    const isTaxActive = true//quote?.fee?.total_details.breakdown?.taxes[0].rate.active
    const upfrontTax = isTaxActive ? (quote?.fee.computed.upfront.total_details.amount_tax ?? 0) / 100 : 0
    const recurringTax = isTaxActive ? (quote?.subscription.computed.recurring?.total_details.amount_tax ?? 0) / 100 : 0
    const total = priceBreakdown.reduce((n, { value }) => n + value, 0) + upfrontTax

    return <>
        <ProjectSummarySubpage name='Add Storage' />
        <GlassSpace size="small">
            <Stack spacing={1}>
                <DynamicStack>
                    <GlassSpace size="tiny" style={{ flex: 1 }}>
                        <GlassText size="moderate">
                            Add an integer number of terabytes to this project
                        </GlassText>
                        <GlassSpace size="tiny" />
                        <TextField
                            type="number"
                            value={tbsToAdd}
                            onChange={e => setTbsToAdd(e.target.value ? Math.min(+e.target.value, 100) : undefined)}
                            label='TBs to add'
                        />
                    </GlassSpace>
                    <div style={{ flex: 1 }}>
                        <GlassCard marginSize="tiny" paddingSize="tiny">
                            <GlassText size="large">
                                {!quote && "(Pre Tax) "}Line Items
                            </GlassText>
                            <GlassSpace size="tiny">
                                {priceBreakdown.map(price => <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <GlassText size="moderate">
                                        {price.message}:
                                    </GlassText>
                                    <GlassText size="moderate">
                                        ${Math.ceil((tbsToAdd ?? 0) * price.value)}
                                    </GlassText>
                                </div>)}
                                {quote && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <GlassText size="moderate">
                                        Tax:
                                    </GlassText>
                                    <GlassText size="moderate">
                                        ${(Math.ceil(tbsToAdd ?? 0) * upfrontTax).toFixed(2)}
                                    </GlassText>
                                </div>}
                                <GlassSpace size="tiny">
                                    <Divider />
                                </GlassSpace>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <GlassText size="moderate">
                                        Total:
                                    </GlassText>
                                    <GlassText size="moderate">
                                        ${(Math.ceil(tbsToAdd ?? 0) * total).toFixed(2)}
                                    </GlassText>
                                </div>
                                <GlassSpace size="tiny">
                                    <Divider />
                                </GlassSpace>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <GlassText size="moderate">
                                        Monthly storage fee (pre tax):
                                    </GlassText>
                                    <GlassText size="moderate">
                                        ${Math.ceil(tbsToAdd ?? 0) * (2.5)}
                                    </GlassText>
                                </div>
                                <GlassSpace size="tiny">
                                    <a href="/privacy-policy" style={{ paddingRight: '1em' }}>Privacy Policy</a>
                                    <a href="/terms-of-service">Terms Of Service</a>
                                </GlassSpace>
                            </GlassSpace>
                        </GlassCard>
                        {tbsToAdd && <Button fullWidth variant="outlined" onClick={() => setPaymentModalState(true)}>Add Storage</Button>}
                    </div>
                </DynamicStack>
            </Stack>
        </GlassSpace>
        {!user.stripeSubscriptionId && properties?.selectedProjectId && <PaymentModal
            state={paymentModalState}
            onClose={() => setPaymentModalState(false)}
            volume={tbsToAdd}
            projectId={properties?.selectedProjectId}
        />}
        {user.stripeSubscriptionId && <BaseModal
            state={paymentModalState}
            close={() => setPaymentModalState(false)}
        >
            <ColorGlassCard paddingSize="large">
                <GlassText size="big" >Everything's setup already!</GlassText>
                <GlassSpace size="tiny">
                    <Divider />
                </GlassSpace>
                <GlassText size="moderate">All fees will be added to your current subscription</GlassText>
                <GlassSpace size="tiny">
                    <a href="/privacy-policy" style={{ paddingRight: '1em' }}>Privacy Policy</a>
                    <a href="/terms-of-service">Terms Of Service</a>
                </GlassSpace>
                <Button onClick={payForStorage} variant="outlined" >Add Storage!</Button>
            </ColorGlassCard>
        </BaseModal>}
    </>
}

export default AddStorage
