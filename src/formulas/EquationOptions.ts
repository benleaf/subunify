import { operationDefinitions } from "./OperationDefinitions";

export const equationOptions = {
    ...operationDefinitions,
    number: { label: 'Number' },
    otherFieldData: { label: 'Other Field' },
}

export type EquationOptionTypes = keyof typeof equationOptions