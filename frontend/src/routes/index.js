import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

// import List from '../pages/List';
import Preview from '../pages/Preview';
import Explorer from '../pages/Explorer';

import Home from '../pages/LandingPage/Home';
import AboutUs from '../pages/LandingPage/AboutUs';
import Help from '../pages/LandingPage/Help';
import Tutorials from '../pages/LandingPage/Tutorials';
import Contact from '../pages/LandingPage/Contact';
// import Notfound from '../pages/LandingPage/NotFound';

export default function Routes() {
  return (
    <Switch>
      {/* <Route isPrivate exact path="/" component={List} /> */}
      {/* <Route isPrivate exact path="/preview/:idList" component={Preview} /> */}
      <Route isPrivate exact path="/preview" component={Preview} />
      <Route isPrivate exact path="/explorer/:id/" component={Explorer} />
	    <Route isHomePage exact path="/" component={Home} />
      <Route isHomePage exact path="/about-us" component={AboutUs} />
      <Route isHomePage exact path="/help" component={Help} />
      <Route isHomePage exact path="/tutorials" component={Tutorials} />
      <Route isHomePage exact path="/contact-us" component={Contact} />
    </Switch>
  );
}
