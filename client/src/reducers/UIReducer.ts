import { ActionTypes } from '../actions';
import { IAction } from '../types';

export default (state: any = {}, action: IAction) => {
  switch (action.type) {
    case ActionTypes.SET_THEME:
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};
