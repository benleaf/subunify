import { RequestableResources } from "./RequestableResources"

type ResourcesWithDtos = Pick<
    RequestableResources,
    {
        [K in keyof RequestableResources]: RequestableResources[K] extends { dto: unknown } ? K : never
    }[keyof RequestableResources]
>

export type ApiEventRequestData<T extends keyof RequestableResources> =
    T extends keyof ResourcesWithDtos ?
    { resource: T, dto: RequestableResources[T]['dto'] } :
    { resource: T }