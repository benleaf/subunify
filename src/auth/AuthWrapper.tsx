import { ReactNode } from "react"
import { useAuth } from "../contexts/AuthContext"
import AuthModal from "./AuthModal"
import PaymentModal from "@/components/modal/PaymentModal"

type Props = {
    children: ReactNode | ReactNode[]
}

const AuthWrapper = ({ children }: Props) => {
    const { user } = useAuth()
    if (!user.email_verified) {
        return <AuthModal overrideState={true} hideButton />
    } else {
        return <div>{children}</div>
    }
}

export default AuthWrapper