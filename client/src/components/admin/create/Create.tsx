import React from 'react';
import { Route } from 'react-router-dom';
import Beast from './Beast';
import Character from './Character';
import Item from './Item';
import Location from './Location';
import Organization from './Organization';

export default () => {
  return (
    <>
      <Route path='/admin/create/item' component={Item} />
      <Route path='/admin/create/character' component={Character} />
      <Route path='/admin/create/monster' component={Beast} />
      <Route path='/admin/create/organization' component={Organization} />
      <Route path='/admin/create/location' component={Location} />
    </>
  );
};
