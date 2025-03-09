import { ApiError } from "@/types/server/ApiError"
import { ApiResponse } from "@/types/server/ApiResponse"

export const isError = <T extends unknown>(result: ApiResponse<T>): result is Partial<ApiError> => {
    return result && typeof result === 'object' && ('message' in result || 'error' in result)
}
