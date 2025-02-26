import { ApplicationEvents } from '@/types/application/ApplicationEvents';
import { ApplicationState } from '@/types/application/ApplicationState';
import { RequestableResources } from '@/types/application/RequestableResources';
import { RequestMethod } from '@/types/server/RequestMethod';
import { Reducer } from 'react';

const resourceMethods: { [key in keyof RequestableResources]: RequestMethod } = {
    'table': 'GET',
    "table/body": 'POST'
}

export const applicationReducer: Reducer<ApplicationState, ApplicationEvents> = (state, event) => {
    switch (event.action) {
        case 'loadData':
            return {
                ...state,
                loadingData: {
                    resource: event.data.resource,
                    dto: 'dto' in event.data ? event.data.dto : undefined,
                    method: resourceMethods[event.data.resource]
                }
            } as ApplicationState
        case 'table':
            return {
                ...state,
                tables: event.data
            }
        case 'table/body':
            return {
                ...state,
                selectedTable: { ...event.data }
            }
        case 'setSelectedScreen':
            return {
                ...state,
                selectedScreen: event.data
            }
        default:
            return state
    }

}