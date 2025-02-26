import { RequestMethod } from "@/types/server/RequestMethod";
import { apiAction } from "../api/apiFetch";
import { RequestableResources } from "@/types/application/RequestableResources";
import { Dto } from "@/types/application/Dto";

export const getResource = async <T extends keyof RequestableResources>(
    resource: T, method: RequestMethod, body?: Dto
): Promise<RequestableResources[T]['result'] | undefined> => {
    const result = await apiAction<RequestableResources[T]['result']>(
        resource as string,
        method,
        'TODO',
        JSON.stringify(body)
    )

    if (result && typeof result === 'object' && 'message' in result) {
        console.log('Unable to get table data, try again later')
    } else {
        return result
    }
}