import { ActionTypes } from '../actions';
import { IAction, IAlert } from '../types';

const alertReducer = (
  state: IAlert | any = { show: false },
  action: IAction
) => {
  switch (action.type) {
    case ActionTypes.DISPLAY_ALERT:
      return {
        ...state,
        level: action.payload.level,
        message: action.payload.message,
        show: true,
      };
    case ActionTypes.HIDE_ALERT:
      return {
        ...state,
        show: false,
      };
    default:
      return state;
  }
};
export default alertReducer;
