import { CollaboratorRoles } from "@/constants/CollaboratorRoles"

export type AddCollaboratorSettings = {
    projectId: string
    email?: string
    role?: keyof typeof CollaboratorRoles
}