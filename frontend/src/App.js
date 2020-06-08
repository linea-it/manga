import React, { useState } from 'react';
import { Router } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Routes from './routes';
import history from './services/history';
import light from './themes/light';
import Header from './components/Header';

function App() {
  const [currentUser] = useState({ username: 'Matheus' });

  return (
    <MuiThemeProvider theme={light}>
      <Header currentUser={currentUser} />
      <Router history={history}>
        <Routes />
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
