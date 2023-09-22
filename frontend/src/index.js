import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './assets/css/index.css';
import * as serviceWorker from './services/serviceWorker';
import App from './App';
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { red } from "@mui/material/colors";

const customTheme = createTheme({
    palette: {
      red: {
        main: red[500],
        dark: red[800]
      }
    }
  });

const queryClient = new QueryClient({
    keepPreviousData: true,
    // refetchInterval: false,
    // // refetchOnWindowFocus: false,
    // // refetchOnmount: false,
    // // refetchOnReconnect: false,
    retry: 1,
    staleTime: 1 * 60 * 60 * 1000,
});


ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={customTheme}>
            <App />
        </ThemeProvider>
    </QueryClientProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
