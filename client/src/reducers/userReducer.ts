import { ActionTypes } from '../actions';
import { IAction, IUser } from '../types';
export interface IUserState {
  user?: IUser;
  isLoggedIn: boolean;
}

const userReducer = (
  state: IUserState | any = { isLoggedIn: false },
  action: IAction
) => {
  switch (action.type) {
    case ActionTypes.LOG_IN:
      return { ...state, isLoggedIn: true, user: action.payload };
    case ActionTypes.LOG_OUT:
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
};

export default userReducer;
