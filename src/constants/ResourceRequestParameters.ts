import { RequestMethod } from "@/types/server/RequestMethod";

export const ResourceRequestParameters = {
    tableGetAll: {
        url: 'table',
        method: 'GET' as RequestMethod,
    },
    tableGetBodyById: {
        url: 'table',
        method: 'GET' as RequestMethod,
    }
}