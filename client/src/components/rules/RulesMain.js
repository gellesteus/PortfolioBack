import React from 'react';
import { Route } from 'react-router-dom';
import RulesTable from './RulesTable';
import RuleExplain from './RuleExplain';

export default function RulesMain() {
  return (
    <div className='content'>
      <Route exact path='/rules' component={RulesTable} />
      <Route path={'/rules/:id'} component={RuleExplain} />
    </div>
  );
}
