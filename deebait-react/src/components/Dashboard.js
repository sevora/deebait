/**
 * This is the Dashboard page and it should only render
 * when user is authenticated. It has Landing Page as its sibling.
 * And only one of them is rendered at a time.
 */
import { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import BrandBar from './BrandBar.js';
import DesktopNavigation from './DesktopNavigation.js';
import MobileNavigation from './MobileNavigation.js';
import Opinions from './Opinions.js';
import Debate from './Debate.js';
import History from './History.js';
import HistoryView from './HistoryView.js';
import FAQ from './FAQ.js';
import Settings from './Settings.js';
import Footer from './Footer.js';

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
        onSessionExpired: function() { return null },
        onAlert: function() { return null }
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
                    <Box ml={2} mr={2} mb={3} pt={3}>
                        <Switch>
                            <Route exact path="/" children={<Opinions headers={this.state.headers} onSessionExpired={this.state.onSessionExpired} onAlert={this.props.onAlert} />}></Route>
                            <Route exact path="/debate" children={<Debate headers={this.state.headers} onSessionExpired={this.state.onSessionExpired} onAlert={this.props.onAlert} />}></Route>
                            <Route exact path="/history" children={<History headers={this.state.headers} onSessionExpired={this.state.onSessionExpired} onAlert={this.props.onAlert} />}></Route>
                            <Route exact path="/history/view/:id" children={<HistoryView headers={this.state.headers} onSessionExpired={this.state.onSessionExpired} onAlert={this.props.onAlert} />}></Route>
                            <Route exact path="/faq" children={<FAQ headers={this.state.headers} onSessionExpired={this.state.onSessionExpired} onAlert={this.props.onAlert} />}></Route>
                            <Route exact path="/settings" children={<Settings headers={this.state.headers} onSessionExpired={this.state.onSessionExpired} onAlert={this.props.onAlert} />}></Route>
                        </Switch>
                        <Footer/>
                    </Box>
                </Box>
                <Paper variant="outlined" sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { sx: 'block', md: 'none' } }} >
                    <MobileNavigation />
                </Paper>
            </Box>
        );
    }
}

export default Dashboard;