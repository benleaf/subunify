import { ApiResponse } from "@/types/server/ApiResponse"
import { RequestMethod } from "@/types/server/RequestMethod"

export const apiAction = async <T>(endpoint: string, method: RequestMethod, body?: string): Promise<ApiResponse<T>> => {
    try {
        const jwtToken = localStorage.getItem("token");
        if (!jwtToken) return { message: 'No Token Supplied, request not sent', error: 'Unauthorized' }

        const response = await fetch(
            import.meta.env.VITE_SERVER_URL + endpoint,
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
    } catch (error: TODO) {
        console.error(
            `ERROR: Unable to perform a (${method}) request to the (${endpoint}) endpoint.`,
            `Request body: ${body ?? "undefined"}.`,
            error
        )

        return { message: 'Unable to perform request' }
    }
}