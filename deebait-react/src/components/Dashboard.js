import { Component } from 'react';
import { Route, Routes } from 'react-router-dom';

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
            <Box sx={{ display: 'flex' }}>
                <DesktopNavigation sx={{
                    display: { xs: 'none', md: 'unset' },
                    width: 200,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 200,
                        boxSizing: 'border-box',
                    }
                }} />
                <Box sx={{ flexGrow: 1, pt: 3 }} ml={3} mr={3}>
                    <Routes>
                        <Route exact path="/" element={<Opinions headers={this.state.headers} onSessionExpired={this.state.onSessionExpired} />}></Route>
                    </Routes>
                </Box>
            </Box>
        );
    }
}

export default Dashboard;