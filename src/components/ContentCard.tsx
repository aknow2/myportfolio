import * as React from 'react';
import { StyleRules, WithStyles, withStyles } from '@material-ui/core/styles';
import { RouteComponentProps, withRouter } from 'react-router';
import { Card, CardActionArea, CardMedia, CardContent, Typography, Chip } from '@material-ui/core';

const styles: StyleRules<'root'|'media'|'chip'|'chips'> = {
    root: {
        width: 300
    },
    media: {
        height: 200
    },
    chip: {
        margin: 10
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap'
    }
};

type ClassNames = keyof typeof styles;

const constants = {
    img: require('../images/emh.png'),
    title: 'endless monster house',
    description: 'android 2d game ',
    techs: [{name:'HTML5'},{name:'Javascript'},{name:'Three.js'},{name:'Cordova'},],
    link: 'https://tmknym.itch.io/endless-monster-house'
}

class ContentCard extends React.Component<
                                            RouteComponentProps<any> &
                                            WithStyles<ClassNames>, 
                                            {}> {

   public render(): JSX.Element {
        const {classes} = this.props;
        return (
        <Card className={classes.root}>
            <CardActionArea onClick={this.link}>
                <CardMedia
                    className={classes.media}
                    image={constants.img}
                    title={constants.title}
                />
                <CardContent>
                    <Typography gutterBottom={true} variant="headline" component="h2">
                        {constants.title}
                    </Typography>
                    <Typography component="p">
                        {constants.description}
                    </Typography>
                    <div className={classes.chips}>
                    {
                        constants.techs.map((t) => {
                            return  <Chip label={t.name} key={t.name} className={classes.chip}/>
                        })
                    }
                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
        );
    }

    private link = () => {
        if (constants.link) {
            window.open(constants.link);
        }
    }

}

const StyledContainer = withStyles<{} & ClassNames>(styles)(ContentCard);

export default withRouter(StyledContainer);