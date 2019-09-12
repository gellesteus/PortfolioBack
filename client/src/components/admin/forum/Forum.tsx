import React from 'react';
import { Route } from 'react-router-dom';
import Category from './Category';
export default () => {
  return (
    <>
      <Route path='/admin/forum/category' component={Category} />
    </>
  );
};
