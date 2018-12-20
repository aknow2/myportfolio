import * as React from 'react';
import { StyleRules, WithStyles, withStyles } from '@material-ui/core/styles';
import { Typography, IconButton, Button, Slide } from '@material-ui/core';
import ArrowDown from '@material-ui/icons/KeyboardArrowDownTwoTone'
import './Top.css'
import Twitter from './icons/twitter.svg';
import Fb from './icons/facebook.svg';

const styles: StyleRules<'social'|'root'|'content'|'icon'|'next'> = {
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '80%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 56,
        height: 56,
    },
    social: {
        position: 'absolute',
        top: 0,
    },
    next: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        bottom: 0,
    }
};

type ClassNames = keyof typeof styles;

interface TopProps {
    next: () => void;
}

class Top extends React.Component<TopProps&WithStyles<ClassNames>, 
                                   {}> {

   public render(): JSX.Element {
        const {classes, next} = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                <Typography color='inherit' variant="title" style={{color: '#C0C0C0'}}>
                    こんにちは。<br />
                    三重県津市で働くソフトウェア開発者、金山です。<br />
                    フロントエンドやモバイル、デスクトップのアプリ開発が得意で<br />
                    最近はクラウドを使ったサーバーレスな設計にはまっています

                </Typography>
                </div>
                <Slide direction={'down'} in={true}>
                    <div className={classes.social}>
                        <IconButton onClick={this.opener('https://twitter.com/aknow21')}>
                            <img src={Twitter} className={classes.icon}/>
                        </IconButton>
                        <IconButton onClick={this.opener('https://www.facebook.com/tomoaki.kanayama.3')}>
                            <img src={Fb} className={classes.icon}/>
                        </IconButton>
                    </div>
                </Slide>
                <Button className={classes.next} onClick={next}>
                    <Typography style={{color: '#c0c0c0'}}>My project</Typography>
                    <ArrowDown fontSize={'large'} style={{color: '#c0c0c0'}}/>
                </Button>
            </div>);
   }

   private opener = (link: string) => {
    return () => {
            window.open(link);
        };
   }
}

const StyledContainer = withStyles<TopProps & ClassNames>(styles)(Top);

export default StyledContainer;