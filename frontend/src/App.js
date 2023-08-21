import React from 'react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import ReactGA from 'react-ga';
import Routes from './routes';
import history from './services/history';
import light from './themes/light';


ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);

history.listen((location) => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

function App() {
  return (
    <ThemeProvider theme={light}>
      <Router history={history}>
        <Routes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
