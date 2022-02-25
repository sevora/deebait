import { Component } from 'react';
import { Route, Routes } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import DesktopNavigation from './DesktopNavigation.js';
import Opinions from './Opinions.js';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headers: this.props.headers ? this.props.headers : {},
            onSessionExpired: this.props.onSessionExpired ? this.props.onSessionExpired : function() { return null }
        }
    }

    static defaultProps = {
        headers: {},
        onSessionExpired: function() { return null }
    }

    render() {
        return (
            <Grid container>
                <Grid item>
                    <DesktopNavigation />
                </Grid>
                <Grid item>
                    <Box m={2}>
                        <Routes>
                            <Route exact path="/" element={<Opinions headers={this.state.headers} onSessionExpired={this.state.onSessionExpired} />}></Route>
                        </Routes>
                    </Box>
                </Grid>
            </Grid>
        );
    }
}

export default Dashboard;