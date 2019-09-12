import React from 'react';
import ArmoryTable from './ArmoryTable';
import ArmoryDetail from './ArmoryDetail';
import { Route } from 'react-router-dom';

export default function armory() {
  return (
    <div className='content'>
      <Route exact path='/armory' component={ArmoryTable} />
      <Route path='/armory/:id' component={ArmoryDetail} />
    </div>
  );
}
