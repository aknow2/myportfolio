
import * as React from 'react';
import { StyleRules, WithStyles, withStyles } from '@material-ui/core/styles';
import ContentCard, { IContents } from './ContentCard';

const styles: StyleRules<'top'|'contents'> = {
    top: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contents: {
        width: '100%',
        marginTop: 20,
        display: 'flex',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap'
    }
};

type ClassNames = keyof typeof styles;

const constantsList: IContents[] = [ 
    {
        img: require('../images/scratch.jpeg'),
        title: '[UNOFFICIAL] scratch3+extension ',
        description: 'scratch3 with custom extension',
        techs: [{name:'Scratch3'},{name: 'Javascript'},{name: 'React.js'}],
        link: {
            github:'https://github.com/aknow2/scratch-gui/tree/customextensions',
            web:'https://aknow2.com/scratch',
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


class Home extends React.Component<
                                            WithStyles<ClassNames>, 
                                            {}> {

   public render(): JSX.Element {
        const { classes } = this.props;
        return (
        <div 
           className={classes.top} 
        >
            <div className={classes.contents}>
                {
                    constantsList.map((c) => {
                        return <ContentCard key={c.title} constants={c} />
                    })
                }
            </div>
        </div>
        );
    }

}

const StyledContainer = withStyles<{} & ClassNames>(styles)(Home);

export default StyledContainer;
