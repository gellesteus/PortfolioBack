import { combineReducers } from 'redux';
import alertReducer from './alertReducer';
import modalReducer from './modalReducer';
import userReducer from './userReducer';

export default combineReducers([userReducer, alertReducer, modalReducer]);
