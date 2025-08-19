import { BundleStorageFile } from "./server/ProjectResult"
import { ProxySettingTypes } from "./server/ProxySettingTypes"
import { User } from "./User"

export type Bundle = {
    id?: string,
    name?: string,
    description?: string,
    modified?: Date,
    bundleUsers?: { id: string, user: User, isOwner: boolean, lastActive: Date | null }[]
    bundleFiles?: { id: string, file: BundleStorageFile, message: string, downloadProxyType: ProxySettingTypes }[]
}