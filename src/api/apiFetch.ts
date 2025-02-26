import { ApiResponse } from "@/types/server/ApiResponse"
import { RequestMethod } from "@/types/server/RequestMethod"

export const apiAction = async <T>(endpoint: string, method: RequestMethod, jwtToken: string, body?: string): Promise<ApiResponse<T>> => {
    try {
        if (!jwtToken) return { message: 'No Token Supplied, request not sent' }
        const response = await fetch(
            'http://localhost:3000/' + endpoint,
            {
                method,
                body,
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "authorization": `Bearer ${jwtToken}`
                }
            }
        )

        return (await response.json()) as ApiResponse<T>
    } catch (error) {
        console.error(
            `ERROR: Unable to perform a (${method}) request to the (${endpoint}) endpoint.`,
            `Request body: ${body ?? "undefined"}.`,
            error
        )

        return { message: 'Unable to perform request' }
    }
}