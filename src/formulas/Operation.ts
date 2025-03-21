import { Formula } from "./Formula";
import { OperationTypes } from "./OperationDefinitions";

export type Operation = {
    [K in OperationTypes]: { [P in K]: Formula[] }
}[OperationTypes]