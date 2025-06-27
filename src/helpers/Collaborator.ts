import { CollaboratorRoles, CollaboratorRolesManager, CollaboratorRolesOwner, CollaboratorRolesThatCanAdd } from "@/constants/CollaboratorRoles"
import { Collaborator } from "@/types/Collaborator"

export const canAdd = (role?: Collaborator['role']): role is keyof typeof CollaboratorRolesThatCanAdd => {
    return Object.keys(CollaboratorRolesThatCanAdd).includes(role ?? 'VIEWER')
}

export const getEditableRoles = (role: keyof typeof CollaboratorRolesThatCanAdd) => {
    const options = {
        OWNER: CollaboratorRolesOwner,
        MANAGER: CollaboratorRolesManager,
    }

    return Object.keys(options[role]) as (keyof typeof CollaboratorRoles)[]
}