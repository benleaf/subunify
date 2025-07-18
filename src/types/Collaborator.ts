import { CollaboratorRoles } from "@/constants/CollaboratorRoles"

export type Collaborator = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    thumbnail: string,
    tagLine: string,
    about: string,
    role: keyof typeof CollaboratorRoles
    lastActive: Date | null,
}