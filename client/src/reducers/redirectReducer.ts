import { ActionTypes } from '../actions';
import { IAction, IRedirect } from '../types';

const redirectReducer = (
  state: IRedirect | any = { redirect: false },
  action: IAction
) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default redirectReducer;
