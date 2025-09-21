import { User } from "../User"
import { Project } from "./ProjectResult"

export type PaymentResult = {
    id: string
    session: string
    terabytes: number
    amount: number
    created: Date
    fulfilled: boolean
    user: User
    project: Project
}