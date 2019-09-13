import { ReactNode } from 'react';
import { AnyAction } from 'redux';
import { Level } from '../components/error/Alert';

export interface IAction extends AnyAction {
  type: string;
  payload: any;
}

export interface IRedirect {
  redirect: boolean;
  url?: string;
}

export interface IUser {
  _id: string;
  created_at: Date;
  email: string;
  file_count: number;
  files: string[];
  last_online: Date;
  must_change_password: boolean;
  role: string;
  session_token: string;
  username: string;
  validated: boolean;
}

export interface IAlert {
  level?: Level;
  message?: string | undefined;
  show: boolean;
}

export interface IModal {
  component?: React.ReactNode;
  show: boolean;
}

export * from './admin';
export * from './data';
export * from './forum';
