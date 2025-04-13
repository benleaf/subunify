import { ApiError } from "@/types/server/ApiError";
import { ApiResponse } from "@/types/server/ApiResponse"
import { RequestMethod } from "@/types/server/RequestMethod"
import { isError } from "./isError";
import axios, { AxiosError } from "axios";

export const apiAction = async <T>(endpoint: string, method: RequestMethod, body?: string | FormData): Promise<ApiResponse<T>> => {
    const response = await rawApiAction(endpoint, method, body)
    if (isError(response)) return response
    return (await response.json()) as ApiResponse<T>
}

export const fileUpload = async (
    endpoint: string,
    body: FormData,
    onProgressUpdate: (progress: number) => void,
): Promise<Response | Partial<ApiError>> => {
    try {
        const jwtToken = localStorage.getItem("token");
        if (!jwtToken) return { message: 'No Token Supplied, request not sent', error: 'Unauthorized' }

        const response = await axios.post(import.meta.env.VITE_SERVER_URL + endpoint, body, {
            timeout: 0,
            headers: {
                "authorization": `Bearer ${jwtToken}`,
            },
            onUploadProgress: (progressEvent) => {
                onProgressUpdate(progressEvent.bytes);
            },
        });

        return response.data
    } catch (error: any) {
        const axiosError = error as AxiosError
        return axiosError.response?.data as ApiError
    }
}

export const rawApiAction = async (
    endpoint: string,
    method: RequestMethod,
    body?: string | FormData
): Promise<Response | Partial<ApiError>> => {
    const contentType = typeof body == 'string' ? { "content-type": 'application/json' } : undefined

    try {
        const jwtToken = localStorage.getItem("token");
        if (!jwtToken) return { message: 'No Token Supplied, request not sent', error: 'Unauthorized' }

        return fetch(
            import.meta.env.VITE_SERVER_URL + endpoint,
            {
                method,
                body,
                headers: {
                    ...contentType,
                    "authorization": `Bearer ${jwtToken}`,
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