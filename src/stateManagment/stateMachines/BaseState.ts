import { ApplicationEvents } from "./application/types/ApplicationEvents";
import { ApplicationStateData, UniversalState } from "./application/types/ApplicationStateData";

export abstract class BaseState {
    constructor(public data: ApplicationStateData) { }
    public abstract handleAction(event: unknown): BaseState

    public handleUniversalActions(event: ApplicationEvents): Partial<UniversalState> {
        switch (event.action) {
            case "loading":
                return { loading: event.data }
            case "popup":
                return { popup: event.data }
            default:
                return {}
        }
    }
}