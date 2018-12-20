import * as React from 'react';
import './App.css';
import { withStyles, Button, Slide, Dialog, IconButton } from '@material-ui/core';
import Menu from '@material-ui/icons/Menu';
import Cancel from '@material-ui/icons/Cancel';
import { StyleRules, WithStyles } from '@material-ui/core/styles';
import Top from './components/Top';
import MyPrj from './components/MyPrj';
import Terms from './components/TermAndPolicy';
import {parse} from 'query-string';


const styles: StyleRules<'root'|'menuButton'|'term'|'policy'|'top'|'tab'|'myProject'|'surface'> = {
  root: {
    position: 'relative',
    top: 0,
    bottom:0,
    left:0,
    margin: 0,
    height: '100vh',
    width: '100%',
    perspective: '80vh',
  },
  menuButton: {
    position: 'absolute',
    zIndex: 10,
    right: 0,
    top: 0,
    marginRight: 10,
    marginTop: 10,
  },
  surface: {
    transformOrigin: '50% 50% -90vh',
    position: 'absolute',
    transformStyle: 'preserve-3d',
    left: '0',
    top: '0',
    width: '100%',
    height: '100vh',
  },
  top: {
    color: '#FFFFFF',
    zIndex: 2,
    backgroundColor: '#2F2F2F',
  },
  myProject: {
    zIndex: 1,
    color: '#FFFFFF',
    backgroundColor: '#2F2F2F',
  },
  policy: {
    zIndex: 1,
    backgroundColor: '#2F2F2F',
  },
  term: {
    zIndex: 1,
    backgroundColor: '#2F2F2F',
  },
  tab: {
    color: '#FFFFFF'
  },
};

type ClassNames = keyof typeof styles;

interface Surface {
    x: number;
    style: React.CSSProperties;
}

interface AppState {
  showMenu: boolean;
  path?: string;
  menuIn: boolean;
  top: Surface;
  myProject: Surface;
  term: Surface;
  policy: Surface;
}

class App extends React.Component<WithStyles<ClassNames>, AppState> {

  private topElemet: HTMLDivElement;


  constructor(props: any) {
    super(props);
    const surfaceGenerator = function* (deg: number){
      let ratio = 0;
      while(true) {
        const toDeg = deg * ratio;
        yield {
            x: toDeg,
            style: { transform: `rotateX(${toDeg}deg)` }
        } as Surface;
        ratio++;
      }
    };

    const baseDeg = -60;
    const itr = surfaceGenerator(baseDeg);

    this.state = {
      showMenu: false,
      menuIn: true,
      top: itr.next().value,
      myProject: itr.next().value,
      term: itr.next().value,
      policy: itr.next().value,
    };
  }

  public componentDidMount(){
   const param = parse(location.search);
   if (param && param.path) {
    const path = param.path
    if (path === 'policy') {
      this.setState({path: 'policy'});
    } else if (path === 'terms') {
      this.setState({path: 'terms'});
    }
    this.toTerms();
   }
  }

  public render() {
    const {classes} = this.props;
    const {top, myProject, term, menuIn, showMenu } = this.state;
    return (
      <div className={classes.root}>
        <Slide direction="left" in={menuIn}>
          <div className={classes.menuButton}>
            <Button onClick={this.showMenu}>
              <Menu style={{color: '#B0B0B0'}} fontSize={'large'}/>
            </Button>
          </div>
        </Slide>
        <div
          className={classes.surface+' '+classes.top}
          style={top.style}
          ref={this.refTop} >
            <Top next={this.toMyProject}/>
        </div>
        <div className={classes.surface+' '+classes.myProject} style={myProject.style}>
          <MyPrj titleIn={menuIn} />
        </div>
        <div className={classes.surface+' '+classes.term} style={term.style}>
          <Terms headerIn={menuIn} path={this.state.path}/>
        </div>
        <Dialog
          open={showMenu}
          fullScreen={true}
        >
         <div 
          style={{
            width: '100%',
            position: 'relative',
            height: '100%',
            backgroundColor: '#404040',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
         >
            <IconButton 
              style={{
                position: 'absolute',
                top: 10,
                right: 20,
              }}
              onClick={this.closeMenu}
            >
              <Cancel fontSize={'large'} style={{color: '#c0c0c0'}}/>
            </IconButton>
              <Button style={{color: '#c0c0c0', fontSize: 48}} onClick={this.toTop}>
                About
              </Button>
              <Button style={{color: '#c0c0c0', fontSize: 48}} onClick={this.toMyProject}>
                My project
              </Button>
              <Button style={{color: '#c0c0c0', fontSize: 48}} onClick={this.toTerms}>
                Terms
              </Button>
         </div>
        </Dialog>
      </div>
    );
  }

  private showMenu = () => {
    this.setState({showMenu: true});
  }

  private closeMenu = () => {
    this.setState({showMenu: false});
  }

  private refTop = (ref: HTMLDivElement|null) => {
    if (ref) {
      this.topElemet = ref;
    }
  }
  private toMyProject = () => {
    this.closeMenu();
    const deltaX = -1 * this.state.myProject.x;
    this.rotate(deltaX);
 }
 private toTerms = () => {
    this.closeMenu();
    const deltaX = -1 * this.state.term.x;
    this.rotate(deltaX);
 }
 
  private toTop = () => {
    this.closeMenu();
    const deltaX = -1 * this.state.top.x;
    this.rotate(deltaX);
 }

 private rotate = (deltaX: number) => {

    if (deltaX === 0) {
      return;
    }

    const scale = 0.2;
    const orgTop = this.state.top; 
    const orgMyPrj = this.state.myProject; 
    const orgTerm = this.state.term; 
    const orgPolicy = this.state.policy; 

    const baseDeg = 60;
    const zoomTransitionTime = 0.2;
    const transitionTime = 0.5*((Math.abs(deltaX))/baseDeg);
    const topDeltaX = orgTop.x + deltaX;
    const myPrjDeltaX = orgMyPrj.x + deltaX;
    const termDeltaX = orgTerm.x + deltaX;
    const policyDeltaX = orgPolicy.x + deltaX;
    const getZindex = (x: number) => {
      const absX = Math.abs(x)/60;
      switch(absX){
        case 0:
          return 5;
        case 1:
          return 4;
        case 2: 
          return 3;
        default: 
          return 0;
      }
    }

    const createRotateSurface = (delta: number) => {
      return {
          x: delta,
          style: {
            transform: `scale(${scale}) rotateX(${delta}deg)`,
            transition: `${transitionTime}s`,
            zIndex: getZindex(delta)
          }
        } as Surface;
    };

    const createZoomSurface = (delta: number) => {
      return  {
          x: delta,
          style: {
            transform: `scale(1) rotateX(${delta}deg)`,
            transition: `${zoomTransitionTime}s`,
            zIndex: getZindex(delta)
          }
        } as Surface;
    };
 
    function* animationSequence(){
      yield {
        top: createRotateSurface(topDeltaX),
        myProject: createRotateSurface(myPrjDeltaX),
        term: createRotateSurface(termDeltaX),
        policy: createRotateSurface(policyDeltaX)
      } as AppState;       
      yield {
        top: createZoomSurface(topDeltaX),
        myProject: createZoomSurface(myPrjDeltaX),
        term: createZoomSurface(termDeltaX),
        policy: createZoomSurface(policyDeltaX),
      } as AppState;   
    }
    
    const itr = animationSequence();

    const listener = () => {
      const result = itr.next();

      const newState = result.value;
      if (newState) {
        this.setState(newState);
      }

      if (result.done) {
        this.topElemet.removeEventListener('transitionend', listener);
        this.setState({
          menuIn: true
        });
      }
    };
    this.topElemet.addEventListener('transitionend', listener);
    this.setState({
      menuIn: false
    });
    const createZoomOutSurface = (org: Surface) => {
      return {
        x: org.x,
        style: {
          transform: `scale(${scale}) rotateX(${org.x}deg)`,
          transition: `${zoomTransitionTime}s`,
          zIndex: getZindex(org.x)
        }
      }
    } 
    this.setState({
      top: createZoomOutSurface(orgTop),
      myProject: createZoomOutSurface(orgMyPrj),
      term: createZoomOutSurface(orgTerm),
      policy:createZoomOutSurface(orgPolicy),
    });
  }

}


export default withStyles<{} & ClassNames>(styles)(App);
