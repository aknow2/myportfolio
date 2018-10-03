import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {orange, indigo, pink} from '@material-ui/core/colors'
import createHistory from 'history/createBrowserHistory';
import { Router, Route } from 'react-router';

const theme = createMuiTheme({
  palette: {
    primary: orange,
    secondary: indigo,
    error: pink
  },
});

const history = createHistory();
ReactDOM.render(
  <MuiThemeProvider theme={theme}>
      <Router history={history}>
        <Route component={App} />
      </Router>
  </MuiThemeProvider>
,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
