import { VideoCodecs } from "@/constants/VideoCodecs"
import { User } from "../User"
import { ProxySettingTypes } from "./ProxySettingTypes"

export type ProjectResult = {
    files: StoredFile[]
    projectSettings: ProjectSettings
} & ProjectPreviewResult

export type ClusterResult = {
    files: StoredFile[]
    id: string
    name: string
    fileCount: number
}

export type ProxyResult = {
    id: string;
    created: Date;
    proxyType: ProxySettingTypes;
    transformation: keyof typeof VideoCodecs;
    lastFileRestore?: Date;
    bytes: string | number;
}

export type StoredFile = {
    id: string,
    name: string,
    description?: string,
    created: Date,
    modified: Date,
    fileLastModified: Date,
    location: 'INSTANT' | 'SHALLOW' | 'DEEP',
    lastFileRestore?: Date,
    bytes: number,
    proxyState: "NA" | "PROCESSING" | "COMPLETE" | "ARCHIVED",
    proxyFiles: ProxyResult[]
}

export type ProjectPreviewResult = {
    id: string
    name: string
    description: string
    totalUploaded: number
    collaborators: number
    created: Date
    modified: Date
    availableTBs: number
    restoreBytes: number
    availableTranscodeSeconds: number
    inviteAccepted: boolean
    lastActive: Date | null
    owner: User
}

export type Project = {
    name: string,
    description: string,
    id: string,
    collaborators: Partial<User>[],
}

export type ProjectSettings = {
    [key in ProxySettingTypes]: keyof typeof VideoCodecs | undefined
}
