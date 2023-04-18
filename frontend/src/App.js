import React from 'react';
import { Router } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Routes from './routes';
import history from './services/history';
import light from './themes/light';

import ReactGA from 'react-ga';

ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);

history.listen((location) => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

function App() {
  return (
    <MuiThemeProvider theme={light}>
      <Router history={history}>
        <Routes />
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
