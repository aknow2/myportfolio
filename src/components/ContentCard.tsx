import * as React from 'react';
import { StyleRules, WithStyles, withStyles } from '@material-ui/core/styles';
import { Card,  CardMedia, CardContent, Typography, Chip, Icon, ButtonBase, Button } from '@material-ui/core';
import WebIcon from "@material-ui/icons/Web";
import PlayStoreImg from "../images/playstore.png";
import AppStoreImg from "../images/appstore.svg";
import githubImg from "../images/github.png";

const styles: StyleRules<'root'|'media'|'chip'|'chips'|'githubBadge'|'playStoreBadge'|'storeLinks'|'title'> = {
    root: {
        marginTop: 10,
        width: 300
    },
    title:{
        padding: 10,
        width:"100%",
        display:"flex",
        fontSize: 24,
        justifyContent: "center",
        fontWeight: 700,
        height: 200
    },
    media: {
        height: 200
    },
    chip: {
        margin: 2
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    playStoreBadge: {
        width: 142,
        height: 40
    },
    githubBadge: {
      height: 41,
      width: 100  
    },
    storeLinks: {
        marginTop: 5
    }
};

type ClassNames = keyof typeof styles;

export interface IContents {
    img?: string,
    title: string,
    description: string,
    techs: Tech[],
    link: {
        web?: string
        android?: string
        ios?: string
        github?: string
    }
}
export interface Tech {
    name: string
}

export interface CardPrpos  {
    constants: IContents;
}


class ContentCard extends React.Component<
                                            CardPrpos &
                                            WithStyles<ClassNames>, 
                                            {}> {

   public render(): JSX.Element {
        const {classes, constants} = this.props;
        const link = constants.link;

        return (
        <Card className={classes.root}>
                {
                    constants.img ? 
                    <CardMedia
                        className={classes.media}
                        image={constants.img}
                        title={constants.title}
                    /> :
                    <Typography className={classes.title}>
                        {constants.title}
                    </Typography>
                }
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
                    <div className= {classes.storeLinks}>
                        { link.android &&
                            <ButtonBase onClick= {this.linkToPlayStore}>
                                <img src={PlayStoreImg} className={classes.playStoreBadge} />
                            </ButtonBase>
                        } 
                        { link.ios && 
                            <ButtonBase onClick= {this.linkToAppStore}>
                                <img src={AppStoreImg} />
                            </ButtonBase>
                        }
                        { link.web && 
                            <Button variant="outlined" color="inherit" onClick= {this.linkToWebPage} >
                            <Icon >
                                <WebIcon />
                            </Icon>
                            <Typography variant="body2" color="inherit">
                            Web apps
                            </Typography>
                            </Button>
                        }
                        { link.github && 
                            <ButtonBase  onClick={this.linkToGithub} >
                                <img src={githubImg} className={classes.githubBadge} />                           
                            </ButtonBase>
                        }
                    </div>
                </CardContent>
        </Card>
        );
    }

    private linkToPlayStore = () => {
            window.open(this.props.constants.link.android);
    }
    private linkToAppStore = () => {
            window.open(this.props.constants.link.ios);
    }
    private linkToWebPage = () => {
            window.open(this.props.constants.link.web);
    }

    private linkToGithub = () => {
            window.open(this.props.constants.link.github);
    }
}

const StyledContainer = withStyles< CardPrpos &{} & ClassNames>(styles)(ContentCard);

export default StyledContainer;