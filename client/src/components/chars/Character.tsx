import PropTypes from 'prop-types';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface IParams {
  id: string;
}

export interface IProps extends RouteComponentProps<IParams> {}
export default (props: IProps) => {
  return <>{props.match.params.id}</>;
};
