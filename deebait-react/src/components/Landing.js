/**
 * This is the Landing Page component where users can log-in the site,
 * Currently only Google Log-In is implemented.
 */
import { Component } from 'react';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import { Link } from 'react-router-dom';

import LoginIcon from '@mui/icons-material/Login';

import Button from '@mui/material/Button';
import MaterialLink from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Footer from './Footer.js';

class Landing extends Component {
    constructor(props) {
        super(props);

        this.onTestButtonClick = this.onTestButtonClick.bind(this);
        this.onSuccessGoogle = this.onSuccessGoogle.bind(this);
        this.onFailureGoogle = this.onFailureGoogle.bind(this);

        this.signal = axios.CancelToken.source();
    }

    static defaultProps = {
        onAlert: function() { return null },
        onSuccessfulAuthentication: function() { return null },
        onUnsuccessfulAuthentication: function() { return null },
    }

    /**
     * This is only used for development/testing
     * It uses the /authentication/testing route only available on
     * development mode.
     */
    onTestButtonClick() {
        // add code to handle error when 
        axios.post(process.env.REACT_APP_API_URL + '/authentication/testing', {}).then(response => {
            this.props.onSuccessfulAuthentication(response.data.token);
        }).catch(function(error) {
            this.props.onUnsuccessfulAuthentication(error);
        }.bind(this));
    }

    /**
     * This is a callback function for the react-google-login component
     * and it is called whenever the log-in process is a success.
     * @param response 
     */
    onSuccessGoogle(response) { 
        axios.post(process.env.REACT_APP_API_URL + '/authentication/google', { tokenId: response.tokenId, cancelToken: this.signal.token  })
            .then(response => {
                this.props.onSuccessfulAuthentication(response.data.token);
            }).catch((error) => {
                this.props.onUnsuccessfulAuthentication(error);
            });
    }

    /**
     * This is a callback function for the react-google-login component
     * and it is called whenever authentication fails. Somehow it gets called also
     * when the load pages by default, they should really fix that.
     */
    onFailureGoogle(error) {
        this.props.onAlert({ title: 'Login Failed', message: 'Google-Login Failed', severity: 'error' })
        console.log(error)
    }

    componentWillUnmount() {
        this.signal.cancel();
    }

    render() {
        return (
            <Grid container sx={{ overflowX: 'hidden' }}>
                <Grid item container xs={12} pt={4} pb={4} sx={{ minHeight: '90vh' }}>
                    <Grid item container xs={12} alignItems="center" justifyContent="center" height="100%">
                        <Grid item xs={12} mb={"-100px"}>
                            <img 
                                alt="Logo"
                                src={`${process.env.PUBLIC_URL}/images/Logo_Large.svg`} 
                                style={
                                    { 
                                        display: 'block', 
                                        height: '100px', 
                                        width: 'auto', 
                                        marginLeft: 'auto', 
                                        marginRight: 'auto' 
                                    }
                                }
                            />
                            <Typography variant="h2" textAlign="center">
                                <Box display="inline" fontWeight="200">dee</Box>
                                <Box display="inline" fontWeight="400" color="primary.main">bait</Box>
                            </Typography>
                            <Typography variant="h4" textAlign="center" fontWeight="lighter">
                                The perfect place to argue.
                            </Typography>
                            <Box mt={'-15px'}>
                                <Footer/>
                            </Box>
                        </Grid>
                        <Grid item container xs={12}>
                            <Grid item container xs={12} justifyContent="center" alignContent="center">
                                { process.env.REACT_APP_DEVELOPMENT_MODE !== 'true' ? 
                                    <GoogleLogin
                                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                        buttonText="LOGIN WITH GOOGLE"
                                        onSuccess={this.onSuccessGoogle}
                                        onFailure={(error) => {this.onFailureGoogle(error)}}
                                        cookiePolicy={'single_host_origin'}
                                    /> :
                                    <Button onClick={this.onTestButtonClick} startIcon={<LoginIcon/>} variant="contained">Log-in Development</Button>
                                }
                            </Grid>
                            <Grid item xs={12} mt={2} ml={2} mr={2}>
                                <Typography textAlign="center" variant="subtitle2">
                                    By logging in, you agree to our <MaterialLink href={process.env.PUBLIC_URL + "/terms-of-service.html"} target="_blank" rel="noreferrer">Terms of Service</MaterialLink>, <MaterialLink href={process.env.PUBLIC_URL + "/privacy-policy.html"} target="_blank" rel="noreferrer">Privacy Policy</MaterialLink>, and <MaterialLink href={process.env.PUBLIC_URL + "/cookie-policy.html"} target="_blank" rel="noreferrer">Cookie Policy</MaterialLink>.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <div 
                    className='right-triangle'
                    style={
                        {   
                            minWidth: '100vw',
                            minHeight: '10vh', 
                            backgroundColor: 'primary.light', 
                        }
                    }>
                </div>
                <Grid pt={5} pb={2} item xs={12} sx={{ minHeight: '20vh', backgroundColor: 'primary.main', color: 'primary.light' }}>
                    <Typography variant="h6" fontWeight="bold" textAlign="center">
                        "Anonymously express your views and beliefs with others through one-on-one 
                        chat"
                    </Typography>
                    <Typography variant="subtitle1" textAlign="center" sx={{ marginLeft: '20vw' }}>
                        <MaterialLink color="primary.light" component={Link} to={'/see/faq'}>Why the login? I thought this was supposed to be anonymous?</MaterialLink>
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

export default Landing;