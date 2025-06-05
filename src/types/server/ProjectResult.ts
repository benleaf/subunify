import { User } from "../User"

export type ProjectResult = {
    files: StoredFile[]
} & ProjectPreviewResult

export type ClusterResult = {
    files: StoredFile[]
    id: string
    name: string
    fileCount: number
}

export type StoredFile = {
    id: string,
    name: string,
    created: Date,
    modified: Date,
    fileLastModified: Date,
    previewUrl: string,
    location: 'INSTANT' | 'SHALLOW' | 'DEEP',
    available?: Date,
    bytes: number,
}

export type ProjectPreviewResult = {
    id: string
    name: string
    description: string
    totalUploaded: number
    collaborators: number
    daysToArchive: number
    availableTBs: number
    inviteAccepted: boolean
    owner: User
}

export type Project = {
    name: string,
    codeName: string,
    description: string,
    id: string,
    projectType: 'large' | 'pro' | 'enterprise'
    collaborators: Partial<User>[],
}

