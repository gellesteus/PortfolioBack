import React from 'react';

import { Route } from 'react-router-dom';
import ArmoryDetail from './ArmoryDetail';
import ArmoryTable from './ArmoryTable';

export default function armory() {
  return (
    <div className="content">
      <Route exact={true} path="/armory" component={ArmoryTable} />
      <Route path="/armory/:id" component={ArmoryDetail} />
    </div>
  );
}
