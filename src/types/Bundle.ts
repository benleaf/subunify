import { StoredFile } from "./server/ProjectResult"
import { User } from "./User"

export type Bundle = {
    id?: string,
    name?: string,
    description?: string,
    modified?: Date,
    bundleUsers?: { id: string, user: User, isOwner: boolean }[]
    bundleFiles?: { id: string, file: StoredFile, message: string }[]
}