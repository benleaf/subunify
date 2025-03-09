import { ReactNode } from "react"
import { useAuth } from "./AuthContext"
import AuthModal from "./AuthModal"
import PaymentModal from "@/components/payments/PaymentModal"

type Props = {
    children: ReactNode | ReactNode[]
}

const AuthWrapper = ({ children }: Props) => {
    const { user, subscribed } = useAuth()
    if (user == null) {
        return <AuthModal overrideState={true} />
    } else if (!subscribed) {
        return <PaymentModal state={'open'} />
    } else {
        return <div>{children}</div>
    }
}

export default AuthWrapper