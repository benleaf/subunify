import { ActionInput } from "@/types/actions/ActionInput";
import { respondToProjectInvite } from "../respondToProjectInvite";
import { getBundleById } from "../getBundleById";

export const getActions = (injection: ActionInput) => ({
    respondToProjectInvite: respondToProjectInvite(injection),
    getBundleById: getBundleById(injection)
})