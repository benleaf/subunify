import { ApplicationEvents } from '@/types/application/ApplicationEvents';
import { ApplicationState } from '@/types/application/ApplicationState';
import { Reducer } from 'react';

export const applicationReducer: Reducer<ApplicationState, ApplicationEvents> = (state, event) => {
    switch (event.action) {
        case 'loadData':
            return {
                ...state,
                loadingData: event.data
            }
        case 'tableGetAll':
            return {
                ...state,
                tables: event.data
            }
        case 'tableGetBodyById':
            return {
                ...state,
                selectedTable: event.data ? { ...event.data } : undefined
            }
        case 'setSelectedScreen':
            return {
                ...state,
                selectedScreen: event.data
            }
        case 'setSelectedTableRows':
            return {
                ...state,
                selectedTable: state.selectedTable ? { ...state.selectedTable, rows: event.data } : undefined
            }
        default:
            return state
    }
}