import React from 'react';
import { Route } from 'react-router-dom';
import Category from './Category';
import Thread from './Thread';

export default () => {
  return (
    <div className='content'>
      <Route exact={true} path='/forum' component={Category} />
      <Route path='/forum/category' component={Category} />
      <Route path='/forum/thread' component={Thread} />
    </div>
  );
};
