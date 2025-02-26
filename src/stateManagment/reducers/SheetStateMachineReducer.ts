import { SheetState } from '@/stateManagment/stateMachine/SheetState'
import { SheetEvents } from '@/types/spreadsheet/SheetEvents';
import { Reducer } from 'react';

export const reducer: Reducer<SheetState, SheetEvents> = (state, event) => state.handleAction(event)