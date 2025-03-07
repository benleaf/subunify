import { StateMachineContexts } from "./StateMachineContexts";

export type StateMachineContext =
    StateMachineContexts[keyof StateMachineContexts] |
    undefined