/**
 * Home works by rendering either the
 * landing page or the dashboard and it also
 * provides some methods other components could use
 * mainly an Alert function and Session expiry function
 * 
 * Alert function - lets any child component show an alert message
 * Session expirty function - lets the home know when to show the landing page again
 */
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

        this.signal = axios.CancelToken.source();

        this.state = {
            headers: null,

            // These are for the alert component
            alertTitle: null,
            alertMessage: null,
            alertSeverity: null,
            alertIsOpen: false
        }
    }

    /**
     * This just closes the alert, used for auto hiding the alert component
     */
    alertOnClose() {
        this.setState({ alertIsOpen: false });
    }
    
    /**
     * This method is meant to be passed as a props on landing page,
     * It accepts a String token and saves that on localStorage and also
     * alerts the user that authentication is a success.
     * @param token A string
     */
    onSuccessfulAuthentication(token) {
        localStorage.setItem('token', token);
        let headers = { Authorization: `Bearer ${token}` };

        this.setState({ 
            headers, 
            alertTitle: 'Success!',
            alertMessage: 'Succesful authentication.',
            alertSeverity: 'success',
            alertIsOpen: true
        });
    }

    /**
     * Also meant to be passed as props on landing page,
     * It simply alerts that something has gone wrong in authentication,
     * doesn't remove the token on localStorage since an unsuccessful authentication
     * could indicate a variety of things such as disconnection from the server
     * @param error An error object
     */
    onUnsuccessfulAuthentication(error) {
        this.setState({ 
            alertTitle: 'Error!',
            alertMessage: 'Authentication failed. Please try again later.',
            alertSeverity: 'error',
            alertIsOpen: true
        });
    }

    /**
     * Meant to be passed as props on children,
     * this manually removes the token and shows an alert
     * that the user's session did expire.
     */
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

    /**
     * Meant to be passed as props on the children components
     * and this allows them to use it as a function to show
     * a custom alert message.
     */
    onCallAlert({ title, text, severity }) {
        this.setState({
            alertTitle: title,
            alertMessage: text,
            alertSeverity: severity,
            alertIsOpen: true
        });
    }

    /**
     * On mount, simply check if the user is valid.
     * The /user/check endpoint helps with that
     */
    componentDidMount() {
        let token = localStorage.getItem('token');
        let headers = {};
        
        if (token) {
            headers = { Authorization: `Bearer ${token}` };
            
            axios.get(process.env.REACT_APP_API_URL + '/user/check', { headers, cancelToken: this.signal })
            .then(() => {
                this.setState({ headers });
            }).catch((error) => {
                if (error.response && error.response.data.title === 'InvalidUser') {
                    localStorage.removeItem('token');
                    this.setState({ headers: {} });
                }
            });

        }
    }

    // In case the component unmounts and the API call isn't finished first, the call should be cancelled.
    componentWillUnmount() {
        this.signal.cancel();
    }

    render() {
        return (
            <Grid>
                <TemporaryAlert title={this.state.alertTitle} severity={this.state.alertSeverity} open={this.state.alertIsOpen} onClose={this.alertOnClose}>
                    {this.state.alertMessage}
                </TemporaryAlert>
                {this.state.headers ? <Dashboard headers={this.state.headers} onSessionExpired={this.onSessionExpired} onAlert={this.onCallAlert} /> :  <Landing onSuccessfulAuthentication={this.onSuccessfulAuthentication} onUnsuccessfulAuthentication={this.onUnsuccessfulAuthentication} onAlert={this.onCallAlert} />}
            </Grid>
        );
    }
}

export default Home;