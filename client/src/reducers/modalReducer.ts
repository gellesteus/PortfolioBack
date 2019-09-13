import { IAction, IModal } from '../types';

const modalReducer = (
  state: IModal | any = { show: false },
  action: IAction
) => {
  switch (action.type) {
    default:
      return state;
  }
};
export default modalReducer;
