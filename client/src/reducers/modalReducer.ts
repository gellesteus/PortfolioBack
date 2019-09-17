import { ActionTypes } from '../actions';
import { IAction, IModal } from '../types';

const modalReducer = (
  state: IModal | any = { show: false },
  action: IAction
) => {
  switch (action.type) {
    case ActionTypes.HIDE_MODAL:
      return { ...state, show: false };
    case ActionTypes.DISPLAY_MODAL:
      return { ...state, show: true, component: action.payload };
    default:
      return state;
  }
};
export default modalReducer;
