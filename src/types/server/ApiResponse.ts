import { ApiError } from "./ApiError";

export type ApiResponse<T> = T | Partial<ApiError>