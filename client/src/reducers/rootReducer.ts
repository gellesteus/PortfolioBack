import { combineReducers } from 'redux';
import { IAlert, IModal, IRedirect } from '../types';
import alertReducer from './alertReducer';
import modalReducer from './modalReducer';
import redirectReducer from './redirectReducer';
import userReducer, { IUserState } from './userReducer';

export default combineReducers({
  alert: alertReducer,
  modal: modalReducer,
  redirect: redirectReducer,
  user: userReducer,
});
