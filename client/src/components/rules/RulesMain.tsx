import React from 'react';
import { Route } from 'react-router-dom';
import RuleExplain from './RuleExplain';
import RulesTable from './RulesTable';

export default function RulesMain() {
  return (
    <div className="content">
      <Route exact={true} path="/rules" component={RulesTable} />
      <Route path={'/rules/:id'} component={RuleExplain} />
    </div>
  );
}
