import { Component } from 'react';
import axios from 'axios';

import Container from '@mui/material/Container';

import Landing from './Landing.js';
import Dashboard from './Dashboard.js';
import TemporaryAlert from './TemporaryAlert.js';

class Home extends Component {
    constructor(props) {
        super(props);

        this.alertOnClose = this.alertOnClose.bind(this);

        this.onSuccessfulAuthentication = this.onSuccessfulAuthentication.bind(this);
        this.onUnsuccessfulAuthentication = this.onUnsuccessfulAuthentication.bind(this);
        this.onSessionExpired = this.onSessionExpired.bind(this);

        this.state = {
            token: null,
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

        this.setState({ 
            token, 
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
                this.setState({ token, headers });
            }).catch((error) => {
                localStorage.removeItem('token');
                this.setState({ token: null, headers: {} });
            });

            // otherwise clear localStorage
        }
    }

    render() {
        return (
            <Container>
                <TemporaryAlert title={this.state.alertTitle} severity={this.state.alertSeverity} open={this.state.alertIsOpen} onClose={this.alertOnClose}>
                    {this.state.alertMessage}
                </TemporaryAlert>
                {this.state.token ? <Dashboard headers={this.state.headers} onSessionExpired={this.onSessionExpired} /> :  <Landing onSuccessfulAuthentication={this.onSuccessfulAuthentication} onUnsuccessfulAuthentication={this.onUnsuccessfulAuthentication} />}
            </Container>
        );
    }
}

export default Home;