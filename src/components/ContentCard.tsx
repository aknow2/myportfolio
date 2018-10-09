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

export interface IContents {
    img: string,
    title: string,
    description: string,
    techs: Tech[],
    link: string
}
export interface Tech {
    name: string
}

export interface CardPrpos  {
    constants: IContents;
}

class ContentCard extends React.Component<
                                            CardPrpos &
                                            RouteComponentProps<any> &
                                            WithStyles<ClassNames>, 
                                            {}> {

   public render(): JSX.Element {
        const {classes, constants} = this.props;
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
        const {constants} = this.props;
        if (constants.link) {
            window.open(constants.link);
        }
    }

}

const StyledContainer = withStyles< CardPrpos &{} & ClassNames>(styles)(ContentCard);

export default withRouter(StyledContainer);