import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';
import VerifierList from '../pages/VerifierList';
import Verifier from '../pages/Verifier';
import VerifierGrid from '../pages/VerifierGrid';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={VerifierList} />
      <Route exact path="/verifier/:megacube" component={Verifier} />
      <Route exact path="/grid/:megacube" component={VerifierGrid} />
    </Switch>
  );
}
