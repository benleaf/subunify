import { useEffect, useState } from "react";
import { Button, Divider, Stack, TextField } from "@mui/material";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import GlassText from "@/components/glassmorphism/GlassText";
import { useDashboard } from "@/contexts/DashboardContext";
import GlassCard from "@/components/glassmorphism/GlassCard";
import DynamicStack from "@/components/glassmorphism/DynamicStack";
import PaymentModal from "@/components/modal/PaymentModal";
import { useAuth } from "@/contexts/AuthContext";
import BaseModal from "@/components/modal/BaseModal";
import ColorGlassCard from "@/components/glassmorphism/ColorGlassCard";
import ProjectSummarySubpage from "@/components/widgets/ProjectSummarySubpage";
import { useAction } from "@/contexts/actions/infrastructure/ActionContext";
import { CssSizes } from "@/constants/CssSizes";
import { Check } from "@mui/icons-material";

const AddStorage = () => {
    const { user } = useAuth()
    const { addProjectStorage, getPromoCodePrice } = useAction()
    const { properties } = useDashboard()
    const [promoCode, setPromoCode] = useState<string>()
    const [tbsToAdd, setTbsToAdd] = useState<number>()
    const [promoPrice, setPromoPrice] = useState<number>()
    const [paymentModalState, setPaymentModalState] = useState(false)

    useEffect(() => {
        const third = async () => {
            if (!promoCode) return setPromoPrice(undefined)
            const price = await getPromoCodePrice(promoCode ?? '')
            const priceOfTbs = (price ?? 0) * (tbsToAdd ?? 0)
            setPromoPrice(priceOfTbs)
        }
        third()
    }, [promoCode])


    const priceBreakdown = [
        { message: '1 Month express upload', value: 35.55 },
        { message: `${(tbsToAdd ?? 0) * 2} hours of video processing`, value: 19.96 },
        { message: `${(tbsToAdd ?? 0)}TB of archival restorations`, value: 12.99 },
    ]

    const subscriptionPrice = 1.99

    const total = priceBreakdown.reduce((n, { value }) => n + value, 0)
    const preDiscountPrice = Math.ceil(tbsToAdd ?? 0) * total

    return <>
        <ProjectSummarySubpage name='Add Storage' />
        <GlassSpace size="small">
            <Stack spacing={1}>
                <DynamicStack>
                    <GlassSpace size="tiny" style={{ flex: 1, display: 'flex', gap: CssSizes.tiny, flexDirection: 'column' }}>
                        <GlassText size="moderate">
                            Add an integer number of terabytes to this project
                        </GlassText>
                        <TextField
                            style={{ maxWidth: 250 }}
                            type="number"
                            value={tbsToAdd}
                            onChange={e => setTbsToAdd(e.target.value ? Math.min(+e.target.value, 100) : undefined)}
                            label='TBs to add'
                        />
                        <TextField
                            style={{ maxWidth: 300 }}
                            type="text"
                            value={promoCode}
                            onChange={e => setPromoCode(e.target.value ?? undefined)}
                            label='Promo Code'
                            slotProps={{
                                input: {
                                    endAdornment: (promoPrice ?? Infinity) < preDiscountPrice && <Check />
                                },
                            }}
                        />
                        <Button disabled={!tbsToAdd} fullWidth variant="outlined" onClick={() => setPaymentModalState(true)}>Add Storage</Button>
                    </GlassSpace>
                    <div style={{ flex: 1 }}>
                        <GlassCard marginSize="tiny" paddingSize="tiny">
                            <GlassText size="large">
                                (Pre Tax) Line Items
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
                                <GlassSpace size="tiny">
                                    <Divider />
                                </GlassSpace>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <GlassText size="moderate">
                                        Promo Discount:
                                    </GlassText>
                                    <GlassText size="moderate">
                                        -${(preDiscountPrice - (promoPrice ?? preDiscountPrice)).toFixed(2)}
                                    </GlassText>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <GlassText size="moderate">
                                        Total:
                                    </GlassText>
                                    <GlassText size="moderate">
                                        ${(promoPrice ?? preDiscountPrice).toFixed(2)}
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
                                        ${(Math.ceil(tbsToAdd ?? 0) * subscriptionPrice).toFixed(2)}
                                    </GlassText>
                                </div>
                                <GlassSpace size="tiny">
                                    <a href="/privacy-policy" style={{ paddingRight: '1em' }}>Privacy Policy</a>
                                    <a href="/terms-of-service">Terms Of Service</a>
                                </GlassSpace>
                            </GlassSpace>
                        </GlassCard>
                    </div>
                </DynamicStack>
            </Stack>
        </GlassSpace>
        {!user.stripeSubscriptionId && properties?.selectedProjectId && <PaymentModal
            state={paymentModalState}
            onClose={() => setPaymentModalState(false)}
            volume={tbsToAdd}
            promoCode={promoCode}
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
                <Button onClick={() => addProjectStorage(properties.selectedProjectId!, tbsToAdd ?? 0, promoCode)} variant="outlined" >
                    Add Storage!
                </Button>
            </ColorGlassCard>
        </BaseModal>}
    </>
}

export default AddStorage
