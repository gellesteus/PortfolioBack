import React from 'react';
import { Route } from 'react-router-dom';

import OrganizationTable from './OrganizationTable';
import OrganizationDetail from './OrganizationDetail';

export default () => {
  return (
    <div className='content'>
      <Route exact path='/organizations' component={OrganizationTable} />
      <Route path={'/organizations/:id'} component={OrganizationDetail} />
    </div>
  );
};
