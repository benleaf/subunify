import { apiAction } from "./apiAction";
import { ResourceRequestParameters } from "@/constants/ResourceRequestParameters";
import { LoadDataRequests } from "@/types/application/ApplicationEvents";
import { ApiError } from "@/types/server/ApiError";
import { ApiResponse } from "@/types/server/ApiResponse";

type Result<T extends LoadDataRequests['data']> = T['resources'] extends { result: unknown } ? T['resources']['result'] : undefined

export const isError = <T extends unknown>(result: ApiResponse<T>): result is Partial<ApiError> => {
    return result && typeof result === 'object' && ('message' in result || 'error' in result)
}

export const getResource = async <T extends LoadDataRequests['data']>(
    request: T
): Promise<Result<T>> => {
    const endpointData = ResourceRequestParameters[request.request]
    const params = request.resources && 'params' in request.resources ?
        `/${Object.values(request.resources.params).join('/')}` :
        ''

    const result = await apiAction<Result<T>>(
        `${endpointData.url}${params}`,
        endpointData.method
    )

    if (result && typeof result === 'object' && 'error' in result) {
        localStorage.removeItem("token");
    } else if (isError(result)) {
        console.error('Unable to get table data, try again later', result)
    } else {
        return result
    }
}