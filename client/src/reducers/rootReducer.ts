import { combineReducers } from 'redux';
import alertReducer from './alertReducer';
import modalReducer from './modalReducer';
import redirectReducer from './redirectReducer';
import UIReducer from './UIReducer';
import userReducer from './userReducer';

export default combineReducers({
  UI: UIReducer,
  alert: alertReducer,
  modal: modalReducer,
  redirect: redirectReducer,
  user: userReducer,
});
