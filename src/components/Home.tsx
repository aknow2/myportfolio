
import * as React from 'react';
import { StyleRules, WithStyles, withStyles } from '@material-ui/core/styles';
import { RouteComponentProps, withRouter } from 'react-router';
import ContentCard from './ContentCard';

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
                <ContentCard /> 
            </div>
        </div>
        );
    }


}

const StyledContainer = withStyles<{} & ClassNames>(styles)(Home);

export default withRouter(StyledContainer);
