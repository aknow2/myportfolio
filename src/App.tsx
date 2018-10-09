import * as React from 'react';
import './App.css';
import { withStyles, AppBar, Toolbar, Typography, Tabs, Tab } from '@material-ui/core';
import { StyleRules, WithStyles } from '@material-ui/core/styles';
import Home from './components/Home';
import { RouteComponentProps, Route, Switch } from 'react-router';
import Policy from './components/Policy';
import Terms from './components/Terms';


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

class App extends React.Component<RouteComponentProps<any> & WithStyles<ClassNames>, AppState> {

  constructor(props: any) {
    super(props);
    this.state = {
      tabName: 'home'
    };
  }

  public componentDidMount(){
   const path = this.props.location.pathname;
   if (path === '/policy') {
     this.setState({tabName: 'policy'});
   } else if (path === '/terms') {
     this.setState({tabName: 'terms'});
   }
  }

  public render() {
    const {classes} = this.props;
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
                        <Tab label="プライバシーポリシー" value={'policy'} className={classes.tab}/>
                        <Tab label="利用規約"  value={'terms'} className={classes.tab}/>
                    </Tabs>
                    </div>
                </div>
                </Toolbar>
            </AppBar>
          <Switch>
            <Route component={Home} exact={true} path="/"/>
            <Route component={Policy} exact={true} path="/policy"/>
            <Route component={Terms} exact={true} path="/terms"/>
          </Switch>
      </div>
    );
  }

  private selectTab = (e: any, v: any) => {
    if (v === 'home') {
      this.props.history.push('/')
    } else if (v === 'policy'){
      this.props.history.push('/policy');
    } else if (v === 'terms') {
      this.props.history.push('/terms');
    }
    this.setState({tabName: v})
  }
}

export default withStyles<{} & ClassNames>(styles)(App);
