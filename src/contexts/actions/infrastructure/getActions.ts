import { ActionInput } from "@/types/actions/ActionInput";
import { addFileAttachment } from "../addFileAttachment";
import { addProjectStorage } from "../addProjectStorage";
import { getBundleById } from "../getBundleById";
import { getFileDownloadUrl } from "../getFileDownloadUrl";
import { getProjectThumbnails } from "../getProjectThumbnails";
import { getUserPayments } from "../getUserPayments";
import { removeFileAttachment } from "../removeFileAttachment";
import { respondToProjectInvite } from "../respondToProjectInvite";
import { restoreFile } from "../restoreFile";
import { wipeProject } from "../wipeProject";
import { getProjectSettings } from "../getProjectSettings";
import { setProjectSettings } from "../setProjectSettings";
import { createProject } from "../createProject";
import { getProjectBytes } from "../getProjectBytes";
import { downloadProject } from "../downloadProject";
import { deleteCollaborator } from "../deleteCollaborator";
import { updateCollaborator } from "../updateCollaborator";
import { addProjectCollaborator } from "../addProjectCollaborator";
import { startStoragePaymentSession } from "../startStoragePaymentSession";
import { fulfillPaymentSession } from "../fulfillPaymentSession";
import { createSharedBundle } from "../createSharedBundle";
import { addFileToSharedBundle } from "../addFileToSharedBundle";

export const getActions = (injection: ActionInput) => ({
    respondToProjectInvite: respondToProjectInvite(injection),
    getBundleById: getBundleById(injection),
    getFileDownloadUrl: getFileDownloadUrl(injection),
    restoreFile: restoreFile(injection),
    wipeProject: wipeProject(injection),
    getUserPayments: getUserPayments(injection),
    getProjectThumbnails: getProjectThumbnails(injection),
    addFileAttachment: addFileAttachment(injection),
    removeFileAttachment: removeFileAttachment(injection),
    addProjectStorage: addProjectStorage(injection),
    getProjectSettings: getProjectSettings(injection),
    setProjectSettings: setProjectSettings(injection),
    createProject: createProject(injection),
    getProjectBytes: getProjectBytes(injection),
    downloadProject: downloadProject(injection),
    deleteCollaborator: deleteCollaborator(injection),
    updateCollaborator: updateCollaborator(injection),
    addProjectCollaborator: addProjectCollaborator(injection),
    startStoragePaymentSession: startStoragePaymentSession(injection),
    fulfillPaymentSession: fulfillPaymentSession(injection),
    createSharedBundle: createSharedBundle(injection),
    addFileToSharedBundle: addFileToSharedBundle(injection),
})