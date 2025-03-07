import { Reducer } from 'react';
import { ApplicationEvents } from './application/types/ApplicationEvents';
import { BaseState } from './BaseState';

export const reducer: Reducer<BaseState, ApplicationEvents> = (state, event) => state.handleAction(event)