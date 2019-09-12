export interface IAction {
  type: string;
  data: any;
}

export enum ActionTypes {
  LOG_IN = 'LOG_IN',
  LOG_OUT = 'LOG_OUT',
  DISPLAY_ALERT = 'DISPLAY_ALERT',
  DISPLAY_MODAL = 'DISPLAY_MODAL',
  HIDE_ALERT = 'HIDE_ALERT',
  HIDE_MODAL = 'HIDE_MODAL',
}
