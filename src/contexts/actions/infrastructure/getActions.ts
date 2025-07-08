import { ActionInput } from "@/types/actions/ActionInput";
import { respondToProjectInvite } from "../respondToProjectInvite";
import { getBundleById } from "../getBundleById";
import { getFileProxyDownloadUrl } from "../downloadFile";

export const getActions = (injection: ActionInput) => ({
    respondToProjectInvite: respondToProjectInvite(injection),
    getBundleById: getBundleById(injection),
    getFileProxyDownloadUrl: getFileProxyDownloadUrl(injection)
})