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
  return { type: ActionTypes.LOG_IN, data: user };
}

export function logOut(): IAction {
  return { type: ActionTypes.LOG_OUT, data: null };
}

export function displayAlert(message: string, level: ELevel): IAction {
  return { type: ActionTypes.DISPLAY_ALERT, data: { level, message } };
}

export function displayModal(component: () => React.ReactNode): IAction {
  return { type: ActionTypes.DISPLAY_MODAL, data: component() };
}

export function hideAlert(): IAction {
  return { type: ActionTypes.HIDE_ALERT, data: null };
}

export function hideModal(): IAction {
  return { type: ActionTypes.HIDE_MODAL, data: null };
}
