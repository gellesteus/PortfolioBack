import React from 'react';
import { Route } from 'react-router-dom';
import Character from './Character';
import CharacterTable from './CharacterTable';

export default function CharsMain() {
  return (
    <div className='content'>
      <Route exact={true} path='/characters' component={CharacterTable} />
      <Route path={'/characters/:id'} component={Character} />
    </div>
  );
}
