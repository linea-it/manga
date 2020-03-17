import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import Route from './Route';
import VerifierList from '../pages/VerifierList';
import Verifier from '../pages/Verifier';
import VerifierGrid from '../pages/VerifierGrid';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/verifier" component={VerifierList} />
      <Route exact path="/verifier/:id" component={VerifierGrid} />
      <Route exact path="/verifier/grid" component={Verifier} />
      <Route exact path="/">
        <Redirect to="/verifier" />
      </Route>
    </Switch>
  );
}
