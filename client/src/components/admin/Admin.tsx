import React from 'react';
import { Route } from 'react-router-dom';
<<<<<<< HEAD
import Create from './create/Create';
import Forum from './forum/Forum';
import Nav from './Nav';
import Overview from './Overview';
import Stats from './Stats';
import Users from './Users';
=======
import Overview from './Overview';
import Stats from './Stats';
import Users from './Users';
import Nav from './Nav';
import Create from './create/Create';
import Forum from './forum/Forum';
>>>>>>> 73ff7058d85f43b81bee64c586d3d4b337561ea0

/* Contains the router for the various admin functions that may need to be carried out.
 Can also gather information about server and database usage */
export default () => {
  return (
    <>
      <div className='left-sidebar'>
        <Nav />
      </div>
      <div className='content'>
        <Route exact path='/admin' component={Overview} />
        <Route path={'/admin/stats'} component={Stats} />
        <Route path={'/admin/users'} component={Users} />
        <Route path={'/admin/create'} component={Create} />
        <Route path={'/admin/forum'} component={Forum} />
      </div>
    </>
  );
};
