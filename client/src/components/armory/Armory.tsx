import React from 'react';
<<<<<<< HEAD
import { Route } from 'react-router-dom';
import ArmoryDetail from './ArmoryDetail';
import ArmoryTable from './ArmoryTable';
=======
import ArmoryTable from './ArmoryTable';
import ArmoryDetail from './ArmoryDetail';
import { Route } from 'react-router-dom';
>>>>>>> 73ff7058d85f43b81bee64c586d3d4b337561ea0

export default function armory() {
  return (
    <div className='content'>
      <Route exact path='/armory' component={ArmoryTable} />
      <Route path='/armory/:id' component={ArmoryDetail} />
    </div>
  );
}
