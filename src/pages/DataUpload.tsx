import { useContext, useEffect } from "react";
import { TablesDeployer } from "@/helpers/TablesDeployer";
import { StateMachineDispatch } from "@/App";
import { useNavigate } from "react-router";
import Stripe from "stripe";
import { isError } from "@/api/isError";
import { useAuth } from "@/auth/AuthContext";

type SessionResult = {
    status: Stripe.Checkout.Session.Status | null;
    paymentStatus: Stripe.Checkout.Session.PaymentStatus;
}

const DataUpload = () => {
    const navigate = useNavigate();
    const context = useContext(StateMachineDispatch)!
    const { dispatch } = context
    const { authAction } = useAuth()

    async function initialize() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get('stripe_session_id');
        const sessionResult = await authAction<SessionResult>(`stripe/subscription/${sessionId}`, "POST");
        if (isError(sessionResult)) {
            throw new Error(sessionResult.error);
        }

        if (sessionResult.status == 'open') {
            console.log(sessionResult.status)
            navigate('/excel-importer')
        }
    }

    useEffect(() => {
        const runFetch = async () => {
            try {
                dispatch({ action: 'loading', data: true })
                await initialize()
                await TablesDeployer.deployFromLocalStore()
                dispatch({ action: 'loading', data: false })
                dispatch({ action: 'startDashboard' })
                navigate('/dashboard')
            } catch (error) {
                dispatch({ action: 'loading', data: false })
                navigate('/')
            }
        }

        runFetch()
    }, [])

    return <></>
}

export default DataUpload