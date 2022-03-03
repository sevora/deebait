import { Component } from 'react';
import axios from 'axios';

import Grid from '@mui/material/Grid';

import Landing from './Landing.js';
import Dashboard from './Dashboard.js';
import TemporaryAlert from './TemporaryAlert.js';

class Home extends Component {
    constructor(props) {
        super(props);

        this.alertOnClose = this.alertOnClose.bind(this);
        this.onCallAlert = this.onCallAlert.bind(this);

        this.onSuccessfulAuthentication = this.onSuccessfulAuthentication.bind(this);
        this.onUnsuccessfulAuthentication = this.onUnsuccessfulAuthentication.bind(this);
        this.onSessionExpired = this.onSessionExpired.bind(this);

        this.state = {
            headers: null,

            alertTitle: null,
            alertMessage: null,
            alertSeverity: null,
            alertIsOpen: false
        }
    }

    alertOnClose() {
        this.setState({ alertIsOpen: false });
    }

    onSuccessfulAuthentication(token) {
        localStorage.setItem('token', token);
        let headers = { Authorization: `Bearer ${token}` };

        this.setState({ 
            headers, 
            alertTitle: 'Success!',
            alertMessage: 'Succesful authentication via Twitter.',
            alertSeverity: 'success',
            alertIsOpen: true
        });
    }

    onUnsuccessfulAuthentication(error) {
        this.setState({ 
            alertTitle: 'Error!',
            alertMessage: 'Authentication failed. Please try again later.',
            alertSeverity: 'error',
            alertIsOpen: true
        });
    }

    onSessionExpired() {
        localStorage.removeItem('token');
        this.setState({ 
            headers: null,
            alertTitle: 'Session Expired',
            alertMessage: 'Please log-in again',
            alertSeverity: 'warning',
            alertIsOpen: true
        });
    }

    onCallAlert({ title, text, severity }) {
        this.setState({
            alertTitle: title,
            alertMessage: text,
            alertSeverity: severity,
            alertIsOpen: true
        });
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        let headers = {};
        
        if (token) {
            headers = { Authorization: `Bearer ${token}` };
            // add code to validate token server-side
            // then update state
            
            axios.get(process.env.REACT_APP_API_URL + '/user/check', { headers })
            .then(() => {
                this.setState({ headers });
            }).catch((error) => {
                if (error.response && error.response.data.title === 'InvalidUser') {
                    localStorage.removeItem('token');
                    this.setState({ headers: {} });
                }
            });

            // otherwise clear localStorage
        }
    }

    render() {
        return (
            <Grid>
                <TemporaryAlert title={this.state.alertTitle} severity={this.state.alertSeverity} open={this.state.alertIsOpen} onClose={this.alertOnClose}>
                    {this.state.alertMessage}
                </TemporaryAlert>
                {/* Both dashboard and landing mess with each other's style somehow */}
                {this.state.headers ? <Dashboard headers={this.state.headers} onSessionExpired={this.onSessionExpired} onAlert={this.onCallAlert} /> :  <Landing onSuccessfulAuthentication={this.onSuccessfulAuthentication} onUnsuccessfulAuthentication={this.onUnsuccessfulAuthentication} />}
            </Grid>
        );
    }
}

export default Home;