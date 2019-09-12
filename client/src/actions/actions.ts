import { level as ELevel } from '../components/helper/Alert';
import { ActionTypes, IAction } from './action';

export function logIn(user: any): IAction {
  return { type: ActionTypes.LOG_IN, data: user };
}

export function logOut(): IAction {
  return { type: ActionTypes.LOG_OUT, data: null };
}

export function displayAlert(message: string, level: ELevel): IAction {
  return { type: ActionTypes.DISPLAY_ALERT, data: { level, message } };
}

export function displayModal(component: () => JSX.Element): IAction {
  return { type: ActionTypes.DISPLAY_MODAL, data: component() };
}

export function hideAlert(): IAction {
  return { type: ActionTypes.HIDE_ALERT, data: null };
}

export function hideModal(): IAction {
  return { type: ActionTypes.HIDE_MODAL, data: null };
}
