import { BaseState } from "../BaseState";
import { ApplicationStateData } from "../application/types/ApplicationStateData";
import { DashboardEvents } from "./types/DashboardEvents";

type DashboardStateData = Extract<ApplicationStateData, { machine: 'dashboard' }>

export abstract class DashboardState extends BaseState {
    constructor(public data: DashboardStateData) {
        super(data)
    }
    public abstract handleAction(event: DashboardEvents): BaseState
}