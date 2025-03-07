import { Reducer } from 'react';
import { ApplicationEvents } from '../stateMachines/application/types/ApplicationEvents';
import { BaseState } from '../stateMachines/BaseState';

export const reducer: Reducer<BaseState, ApplicationEvents> = (state, event) => state.handleAction(event)