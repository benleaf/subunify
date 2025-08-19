import { BundleStorageFile, StoredFile } from '@/types/server/ProjectResult';
import moment from 'moment';

export const getLocation = (file: BundleStorageFile): StoredFile['location'] => {
    if (file.created == null) return 'DEEP'

    if (moment().isAfter(moment(file.created).add(30, 'days'))) {
        return 'DEEP'
    }
    return 'INSTANT'
}

export const getDisplayFile = (file: BundleStorageFile): StoredFile => ({
    ...file,
    proxyFiles: file.proxyFiles ?? [],
    attachedFiles: [],
    location: getLocation(file),
    modified: file.fileLastModified,
    bytes: +file.bytes,
    created: file.created,
    proxyState: file.proxyState ?? 'NA',
})