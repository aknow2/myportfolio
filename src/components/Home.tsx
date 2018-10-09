
import * as React from 'react';
import { StyleRules, WithStyles, withStyles } from '@material-ui/core/styles';
import { RouteComponentProps, withRouter } from 'react-router';
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
        img: require('../images/emh.png'),
        title: 'endless monster house',
        description: 'android 2d game ',
        techs: [{name:'HTML5'},{name:'Javascript'},{name:'Three.js'},{name:'Cordova'},],
        link: 'https://tmknym.itch.io/endless-monster-house'
    },
    {
        img: require('../images/rd.png'),
        title: '青空速読',
        description: '青空文庫でお手軽、速読トレーニング',
        techs: [{name:'HTML5'},{name:'Javascript'},{name: 'Typescript'},{name:'Cordova'},{name: 'nodejs'}],
        link: 'https://play.google.com/store/apps/details?id=io.zitan.sokudoku&hl=lo'
    },
];


class Home extends React.Component<
                                            RouteComponentProps<any> &
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

export default withRouter(StyledContainer);
