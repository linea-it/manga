import React from 'react';
import { Router } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Routes from './routes';
import history from './services/history';
import light from './themes/light';

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
