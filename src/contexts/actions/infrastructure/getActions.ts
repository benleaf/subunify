import { ActionInput } from "@/types/actions/ActionInput";
import { respondToProjectInvite } from "../respondToProjectInvite";
import { getBundleById } from "../getBundleById";
import { getFileDownloadUrl } from "../getFileDownloadUrl";
import { restoreFile } from "../restoreFile";
import { wipeProject } from "../wipeProject";

export const getActions = (injection: ActionInput) => ({
    respondToProjectInvite: respondToProjectInvite(injection),
    getBundleById: getBundleById(injection),
    getFileDownloadUrl: getFileDownloadUrl(injection),
    restoreFile: restoreFile(injection),
    wipeProject: wipeProject(injection),
})