export const CollaboratorRolesManager = {
    COLLABORATOR: 'Collaborator',
    VIEWER: 'Viewer',
}

export const CollaboratorRolesOwner = {
    MANAGER: 'Manager',
    ...CollaboratorRolesManager
}

export const CollaboratorRoles = {
    OWNER: 'Owner',
    ...CollaboratorRolesOwner
}

export const CollaboratorRolesThatCanAdd = {
    OWNER: 'Owner',
    MANAGER: 'Manager',
}