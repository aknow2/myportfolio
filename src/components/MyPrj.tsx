
import * as React from 'react';
import { StyleRules, WithStyles, withStyles } from '@material-ui/core/styles';
import ContentCard, { IContents } from './ContentCard';
import { GridList, Typography, Zoom } from '@material-ui/core';

const styles: StyleRules<'top'|'contents'|'header'| 'scroll'> = {
    top: {
        width: '100%',
        height: '100vh',
    },
    header: {
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 10,
    },
    contents: {
        overflowX: 'hidden',
        paddingBottom: 10,
        display: 'flex',
        justifyContent: 'center'
    },
    scroll: {
        width: '98vw',
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'scroll',
    }
};

type ClassNames = keyof typeof styles;

const constantsList: IContents[] = [ 
    {
        title: 'Myriad api',
        img: require('../images/myriad.png'),
        description: 'Transform your smartphone into an API server',
        techs: [{name:'react-native'},{name:'Typescript'},{name:'Node.js mobile'},],
        link: {
            android: 'https://play.google.com/store/apps/details?id=com.myriad',
            github: 'https://myriadapi.github.io/ja/',
        } 
    },
    {
        img: require('../images/scratch.jpeg'),
        title: '[UNOFFICIAL] scratch3+extension ',
        description: 'scratch3 with custom extension',
        techs: [{name:'Scratch3'},{name: 'Javascript'},{name: 'React.js'}],
        link: {
            github:'https://github.com/aknow2/scratch-gui/tree/customextensions',
            web:'https://aknow2.github.io/scratch',
        } 
    },
    {
        title: 'tsnode-typescript-boilerplate',
        description: 'minimal nodejs boilerplate for Typescript',
        techs: [{name:'nodejs'},{name: 'Typescript'}],
        link: {
            github:'https://github.com/aknow2/tsnode-typescript-boilerplate',
        } 
    },
    {
        img: require('../images/rd.png'),
        title: '青空速読',
        description: '青空文庫でお手軽、速読トレーニング',
        techs: [{name:'HTML5'},{name:'Javascript'},{name:'Cordova'},{name: 'nodejs'}, {name: 'GCP'}],
        link: {
            android:'https://play.google.com/store/apps/details?id=io.zitan.sokudoku&hl=lo',
            ios: "https://itunes.apple.com/us/app/%E9%9D%92%E7%A9%BA%E9%80%9F%E8%AA%AD/id1439173789?l=ja&ls=1&mt=8"
        } 
    },
    {
        img: require('../images/convert2g.png'),
        title: '大さじ？g',
        description: '大さじ小さじをグラムへ一発変換',
        techs: [{name:'React Native'},{name: 'Typescript'},{name:'Redux'},{name: 'Redux saga'}],
        link: {
            android:'https://play.google.com/store/apps/details?id=io.zitan.sokudoku&hl=lo',
            ios: "https://itunes.apple.com/us/app/%E9%9D%92%E7%A9%BA%E9%80%9F%E8%AA%AD/id1439173789?l=ja&ls=1&mt=8"
        } 
    },
    {
        img: require('../images/emh.png'),
        title: 'endless monster house',
        description: 'android 2d game ',
        techs: [{name:'HTML5'},{name:'Javascript'},{name:'Three.js'},{name:'Cordova'},],
        link: {
            web: 'https://tmknym.itch.io/endless-monster-house'
        } 
    },
    {
        title: 'レジ遊び',
        description: '子供向けレジWebアプリ',
        techs: [{name:'HTML5'},{name:'Javascript'},{name:'indexedDB'}],
        link: {
            web: 'http://tm-knym.github.io/learnrezi/'
        } 
    },
];

interface MyPrjProps {
    titleIn: boolean;

}

class MyPrj extends React.Component<MyPrjProps & WithStyles<ClassNames>, 
                                            {}> {

   public render(): JSX.Element {
        const { classes, titleIn } = this.props;
        return (
        <div 
           className={classes.top} 
        >
        <Zoom in={titleIn}>
            <div className={classes.header}>
                <Typography variant="title" style={{color: '#C0C0C0'}}>
                    My project
                </Typography>
            </div>
        </Zoom>
            <div className={classes.contents}>
            <GridList className={classes.scroll}>
                {
                    constantsList.map((c) => {
                        return <ContentCard key={c.title} constants={c} />
                    })
                }
            </GridList>
            </div>
        </div>
        );
    }

}

const StyledContainer = withStyles<{} & ClassNames>(styles)(MyPrj);

export default StyledContainer;
