import React from 'react';
import Toggle from '../layout/Toggle';
import PropTypes from 'prop-types';

/* Main admin dashboard. Has overview of all data at a glance and can drill down into specific data */
export default () => {
  return (
    <>
      <Toggle heading="Toggley" component={header} />
    </>
  );
};

export interface IProps {
  header?: string;
  component?: React.ElementType;
}

const header = (props: IProps) => {
  return (
    <>
      <h1>Testing</h1>
    </>
  );
};
