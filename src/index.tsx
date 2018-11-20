import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {orange, indigo, pink } from '@material-ui/core/colors'

const theme = createMuiTheme({
  palette: {
    primary: orange,
    secondary: indigo,
    error: pink,
  },
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>
,
  document.getElementById('root') as HTMLElement
);
