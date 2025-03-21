export const operationDefinitions = {
    '+': { label: '(+)' },
    '-': { label: '(-)' },
    '*': { label: '(x)' },
    '/': { label: '(÷)' },
}

export type OperationTypes = keyof typeof operationDefinitions