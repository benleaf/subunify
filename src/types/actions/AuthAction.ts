import { ApiError } from "../server/ApiError";
import { RequestMethod } from "../server/RequestMethod";

export type AuthAction = <T>(endpoint: string, method: RequestMethod, body?: string | FormData) => Promise<T | Partial<ApiError>>