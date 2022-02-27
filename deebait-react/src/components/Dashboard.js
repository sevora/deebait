import { Component } from 'react';
import { Route, Routes } from 'react-router-dom';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import BrandBar from './BrandBar.js';
import DesktopNavigation from './DesktopNavigation.js';
import MobileNavigation from './MobileNavigation.js';
import Opinions from './Opinions.js';
import Debate from './Debate.js';
import Live from './Live.js';
import History from './History.js';
import FAQ from './FAQ.js';
import Settings from './Settings.js';

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
                <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{display: {sx: 'block', md: 'none'}}}>
                        <BrandBar />
                    </Box>
                    <Box ml={3} mr={3} pt={3}>
                        <Routes>
                            <Route exact path="/" element={<Opinions headers={this.state.headers} onSessionExpired={this.state.onSessionExpired} />}></Route>
                            <Route exact path="/debate" element={<Debate headers={this.state.headers} onSessionExpired={this.state.onSessionExpired} />}></Route>
                            <Route exact path="/live" element={<Live headers={this.state.headers} onSessionExpired={this.state.onSessionExpired} />}></Route>
                            <Route exact path="/history" element={<History headers={this.state.headers} onSessionExpired={this.state.onSessionExpired} />}></Route>
                            <Route exact path="/faq" element={<FAQ headers={this.state.headers} onSessionExpired={this.state.onSessionExpired} />}></Route>
                            <Route exact path="/settings" element={<Settings headers={this.state.headers} onSessionExpired={this.state.onSessionExpired} />}></Route>
                        </Routes>
                    </Box>
                </Box>
                <Paper elevation={10} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { sx: 'block', md: 'none' } }} >
                    <MobileNavigation />
                </Paper>
            </Box>
        );
    }
}

export default Dashboard;