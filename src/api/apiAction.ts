import { ApiError } from "@/types/server/ApiError";
import { ApiResponse } from "@/types/server/ApiResponse"
import { RequestMethod } from "@/types/server/RequestMethod"
import { isError } from "./isError";
import { getValidAccessToken, SessionUser } from "@/auth/AuthService";
import { createWriteStream } from "streamsaver";

export type ApiActionParams = {
    endpoint: string,
    method: RequestMethod,
    body?: string | FormData | Blob,
    signal?: AbortSignal,
    sessionUser: SessionUser
}

export type DownloadParameters = {
    endpoint: string,
    sessionUser: SessionUser,
    bytes: number
}

export const apiAction = async <T>(params: ApiActionParams): Promise<ApiResponse<T>> => {
    const response = await rawApiAction(params)
    if (isError(response)) return response
    return (await response.json()) as ApiResponse<T>
}

export const rawApiAction = async ({ endpoint, method, body, signal, sessionUser }: ApiActionParams): Promise<Response | Partial<ApiError>> => {
    const contentType = typeof body == 'string' ? { "content-type": 'application/json' } : undefined
    const token = await getValidAccessToken(sessionUser)

    try {
        return fetch(
            import.meta.env.VITE_SERVER_URL + endpoint,
            {
                method,
                signal,
                body,
                headers: {
                    ...contentType,
                    "authorization": `Bearer ${token}`,
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

export const download = async ({ endpoint, sessionUser, bytes }: DownloadParameters) => {
    const token = await getValidAccessToken(sessionUser)

    const fileStream = createWriteStream(
        'files.zip',
        { size: bytes }
    );
    const writer = fileStream.getWriter();

    const res = await fetch(import.meta.env.VITE_SERVER_URL + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!res.ok || !res.body) throw new Error(res.statusText);

    const reader = res.body.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        writer.write(value);
    }
    writer.close();
}