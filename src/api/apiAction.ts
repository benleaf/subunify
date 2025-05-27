import { ApiError } from "@/types/server/ApiError";
import { ApiResponse } from "@/types/server/ApiResponse"
import { RequestMethod } from "@/types/server/RequestMethod"
import { isError } from "./isError";
import { CognitoUserSession } from "amazon-cognito-identity-js";

export type ApiActionParams = {
    endpoint: string,
    method: RequestMethod,
    body?: string | FormData | Blob,
    signal?: AbortSignal,
    session: CognitoUserSession | null
}

export const apiAction = async <T>(params: ApiActionParams): Promise<ApiResponse<T>> => {
    const response = await rawApiAction(params)
    if (isError(response)) return response
    return (await response.json()) as ApiResponse<T>
}

export const rawApiAction = async ({ endpoint, method, body, signal, session }: ApiActionParams): Promise<Response | Partial<ApiError>> => {
    const contentType = typeof body == 'string' ? { "content-type": 'application/json' } : undefined

    try {
        const tokenValid = session && session.getAccessToken().getExpiration() > Date.now() / 1000
        if (!tokenValid) return { message: 'No Token Supplied, request not sent', error: 'Unauthorized' }

        return fetch(
            import.meta.env.VITE_SERVER_URL + endpoint,
            {
                method,
                signal,
                body,
                headers: {
                    ...contentType,
                    "authorization": `Bearer ${session.getAccessToken().getJwtToken()}`,
                }
            }
        )
    } catch (error: TODO) {
        console.error(
            `ERROR: Unable to perform a (${method}) request to the (${endpoint}) endpoint.`,
            `Request body: ${body ?? "undefined"}.`,
            error
        )

        return { message: 'Unable to perform request' }
    }
}