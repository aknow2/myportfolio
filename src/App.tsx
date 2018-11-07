import * as React from 'react';
import './App.css';
import { withStyles, AppBar, Toolbar, Typography, Tabs, Tab } from '@material-ui/core';
import { StyleRules, WithStyles } from '@material-ui/core/styles';
import Home from './components/Home';
import Policy from './components/Policy';
import Terms from './components/Terms';
import {parse} from 'query-string';


const styles: StyleRules<'root'|'header'|'tab'> = {
  root: {
    top: 0,
    margin: 0,
    height: '100%',
    width: '100%'
  },
  header: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
  },
  tab: {
        color: '#FFFFFF'
  },
};

type ClassNames = keyof typeof styles;

interface AppState {
  tabName: string,
}

class App extends React.Component<WithStyles<ClassNames>, AppState> {

  constructor(props: any) {
    super(props);
    this.state = {
      tabName: 'home'
    };
  }

  public componentDidMount(){
   const param = parse(location.search);
   if (param && param.path) {
    const path = param.path
    if (path === 'policy') {
      this.setState({tabName: 'policy'});
    } else if (path === 'terms') {
      this.setState({tabName: 'terms'});
    }
   }
  }

  public render() {
    const {classes} = this.props;
    const {tabName} = this.state;
    return (
      <div className={classes.root}>
            <AppBar position="static" >
                <Toolbar>
                <div className={classes.header}>
                    <Typography variant="display3" className={classes.tab} >
                        aKnow2
                    </Typography>
                    <div>
                    <Tabs
                        value={this.state.tabName}
                        indicatorColor="secondary"
                        onChange={this.selectTab}
                        fullWidth={true}
                    >
                        <Tab label="My Works" value={'home'} className={classes.tab}/>
                        <Tab label="Privacy policy" value={'policy'} className={classes.tab}/>
                        <Tab label="Terms"  value={'terms'} className={classes.tab}/>
                    </Tabs>
                    </div>
                </div>
                </Toolbar>
            </AppBar>
            {
              tabName === 'home' &&
              <Home />
            }
            {
              tabName === 'policy' &&
              <Policy />
            }
             {
              tabName === 'terms' &&
              <Terms />
            }
      </div>
    );
  }

  private selectTab = (e: any, v: any) => {
    this.setState({tabName: v})
  }
}

export default withStyles<{} & ClassNames>(styles)(App);
