import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

// import List from '../pages/List';
import Preview from '../pages/Preview';
import Explorer from '../pages/Explorer';

export default function Routes() {
  return (
    <Switch>
      {/* <Route isPrivate exact path="/" component={List} /> */}
      {/* <Route isPrivate exact path="/preview/:idList" component={Preview} /> */}
      <Route isPrivate exact path="/" component={Preview} />
      <Route isPrivate exact path="/explorer/:id/" component={Explorer} />
    </Switch>
  );
}
