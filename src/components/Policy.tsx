import * as React from 'react';
import { StyleRules, WithStyles, withStyles } from '@material-ui/core/styles';
import { RouteComponentProps, withRouter } from 'react-router';
import { Typography, Paper } from '@material-ui/core';

const styles: StyleRules<'root'|'paper'> = {
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 20
    },
    paper: {
        width: '90%',
    }
};

type ClassNames = keyof typeof styles;


class Policy extends React.Component<
                                            RouteComponentProps<any> &
                                            WithStyles<ClassNames>, 
                                            {}> {

   public render(): JSX.Element {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <Typography variant="headline" component="h3">
                    プライバシーポリシー
                    </Typography>
                    <Typography component="p">
                    ほげほげ
                    </Typography>
                </Paper>
            </div>
        );
    }

}

const StyledContainer = withStyles<{} & ClassNames>(styles)(Policy);

export default withRouter(StyledContainer);