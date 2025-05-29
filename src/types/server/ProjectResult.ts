export type ProjectResult = {
    clusters: ClusterPreviewResult[]
} & ProjectPreviewResult

export type ClusterPreviewResult = {
    previewImages: string[]
} & BaseCluster

export type ClusterResult = {
    files: StoredFile[]
} & BaseCluster

type BaseCluster = {
    id: string
    name: string
    fileCount: number
}

export type StoredFile = {
    id: string,
    name: string,
    uploaded: Date,
    modified: Date,
    previewUrl: string,
    location: 'INSTANT' | 'SHALLOW' | 'DEEP',
    available?: Date,
    size: number,
}

export type ProjectPreviewResult = {
    id: string
    name: string
    description: string
    uploaded: number
    collaborators: number
    daysToArchive: number
}

