import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';
import List from '../pages/List';
import Preview from '../pages/Preview';
import Explorer from '../pages/Explorer';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={List} />
      <Route exact path="/preview/:idList" component={Preview} />
      <Route exact path="/explorer/:megacube/" component={Explorer} />
    </Switch>
  );
}
