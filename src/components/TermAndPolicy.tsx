
import * as React from 'react';
import { StyleRules, WithStyles, withStyles } from '@material-ui/core/styles';
import {  Fade, Tabs, Tab, Typography } from '@material-ui/core';
import Terms from './Terms';
import Policy from './Policy';

const styles: StyleRules<'top'|'contents'|'header'|'desc'> = {
    top: {
        width: '100%',
        height: '100vh',
    },
    header: {
        marginLeft: 10,
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        color: '#C0C0C0'
    },
    contents: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 15,
    },
    desc: {
        margin: 15,
        color: '#c0c0c0',
        width: '80%'
    }
};

type ClassNames = keyof typeof styles;

interface MyPrjProps {
    headerIn: boolean;
    path?: string;
}

interface ThisState {
    tabIndex: number;
    tabInit: boolean;
}

class MyPrj extends React.Component<MyPrjProps & WithStyles<ClassNames>, 
                                            ThisState> {

    constructor(props: any){
        super(props);
        this.state = {
            tabIndex: 0,
            tabInit: false
        }
    }

    public componentDidUpdate(){
        if(!this.state.tabInit) {
            if (this.props.path === 'terms') {
                this.setState({
                    tabIndex:0,
                    tabInit: true
                });
            } else if (this.props.path === 'policy' && this.state.tabIndex !== 1) {
                this.setState({
                    tabIndex:1,
                    tabInit: true              
                });
            }
        }
    }

   public render(): JSX.Element {
        const { classes, headerIn } = this.props;
        const { tabIndex } = this.state;
        return (
        <div 
           className={classes.top} 
        >
        <Fade in={headerIn}>
            <Typography variant="body2" style={{color: '#c0c0c0'}} className={classes.desc}>
                利用規約<br/>
                プライバシーポリシー
            </Typography>
        </Fade>
        <div className={classes.contents}>
            <Typography variant="body1" style={{color: '#c0c0c0', marginLeft: 15, marginRight: 15}}>
                aKnow2名義でリリースしているアプリやサービスの利用規約とプライバシーです。
            </Typography>
            <Tabs className={classes.header} value={tabIndex} onChange={this.changeTabIndex}>
                <Tab label="Terms" />
                <Tab label="Policy" />
            </Tabs>
            <div>
            { tabIndex === 0 && <Terms /> }
            { tabIndex === 1 && <Policy /> }
           </div>
        </div>
        </div>
        );
    }

    private changeTabIndex = (event: any, index: number) => {
        this.setState({tabIndex: index});
    }
}

const StyledContainer = withStyles<{} & ClassNames>(styles)(MyPrj);

export default StyledContainer;
