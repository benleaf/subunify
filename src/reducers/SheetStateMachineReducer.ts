import { SheetState } from '@/stateMachine/SheetState'
import { SheetEvents } from '@/types/SheetEvents';
import { Reducer } from 'react';

export const reducer: Reducer<SheetState, SheetEvents> = (state, event) => state.handleAction(event)