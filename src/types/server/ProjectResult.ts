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
    description?: string,
    created: Date,
    modified: Date,
    fileLastModified: Date,
    location: 'INSTANT' | 'SHALLOW' | 'DEEP',
    available?: Date,
    bytes: number,
    proxyState: "NA" | "PROCESSING" | "COMPLETE" | "ARCHIVED"
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
    description: string,
    id: string,
    projectType: 'large' | 'pro' | 'enterprise'
    collaborators: Partial<User>[],
}

