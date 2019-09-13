import { Level as ELevel } from '../components/error/Alert';
import { IAction } from '../types';
export enum ActionTypes {
  LOG_IN = 'LOG_IN',
  LOG_OUT = 'LOG_OUT',
  DISPLAY_ALERT = 'DISPLAY_ALERT',
  DISPLAY_MODAL = 'DISPLAY_MODAL',
  HIDE_ALERT = 'HIDE_ALERT',
  HIDE_MODAL = 'HIDE_MODAL',
}

export function logIn(user: any): IAction {
  return { type: ActionTypes.LOG_IN, payload: user };
}

export function logOut(): IAction {
  return { type: ActionTypes.LOG_OUT, payload: null };
}

export function displayAlert(message: string, level: ELevel): IAction {
  return { type: ActionTypes.DISPLAY_ALERT, payload: { level, message } };
}

export function displayModal(component: () => React.ReactNode): IAction {
  return { type: ActionTypes.DISPLAY_MODAL, payload: component() };
}

export function hideAlert(): IAction {
  return { type: ActionTypes.HIDE_ALERT, payload: null };
}

export function hideModal(): IAction {
  return { type: ActionTypes.HIDE_MODAL, payload: null };
}