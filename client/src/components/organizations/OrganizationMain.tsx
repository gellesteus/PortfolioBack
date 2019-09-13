import React from 'react';
import { Route } from 'react-router-dom';

import OrganizationDetail from './OrganizationDetail';
import OrganizationTable from './OrganizationTable';

export default () => {
  return (
    <div className="content">
      <Route exact path="/organizations" component={OrganizationTable} />
      <Route path={'/organizations/:id'} component={OrganizationDetail} />
    </div>
  );
};
