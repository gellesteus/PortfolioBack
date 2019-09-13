import { ActionTypes } from '../actions';
import { IAction, IRedirect } from '../types';

const redirectReducer = (
  state: IRedirect | any = { redirect: false },
  action: IAction
) => {
  switch (action.type) {
    case ActionTypes.REDIRECT:
      return { ...state, redirect: true, url: action.payload };
    case ActionTypes.STOP_REDIRECT:
      return { ...state, redirect: false };
    default:
      return state;
  }
};

export default redirectReducer;
