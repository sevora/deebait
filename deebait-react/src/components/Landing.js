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

    onTestButtonClick() {
        // add code to handle error when 
        axios.post(process.env.REACT_APP_API_URL + '/authentication/testing', {}).then(response => {
            this.props.onSuccessfulAuthentication(response.data.token);
        }).catch(function(error) {
            this.props.onUnsuccessfulAuthentication(error);
        }.bind(this));
    }

    onSuccessGoogle(response) { 
        axios.post(process.env.REACT_APP_API_URL + '/authentication/google', { tokenId: response.tokenId, cancelToken: this.signal  })
            .then(response => {
                this.props.onSuccessfulAuthentication(response.data.token);
            }).catch((error) => {
                this.props.onUnsuccessfulAuthentication(error);
            });
    }

    onFailureGoogle() {
        this.props.onAlert({ title: 'Login Failed', message: 'Google-Login Failed', severity: 'error' })
    }

    componentWillUnmount() {
        this.signal.cancel();
    }

    render() {
        return (
            <Grid container>
                <Grid item container xs={12} md={7} sx={{ minHeight: { xs: "70vh", md: "100vh" } }}>
                    <Grid item container xs={12} alignItems="center" justifyContent="center" height="100%">
                        <Grid item xs={12}>
                            <Typography variant="h1" textAlign="center">
                                dee<Box color="primary.main" display="inline">bait</Box>
                            </Typography>
                            <Typography variant="h4" textAlign="center">
                                The perfect place to argue.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={12} md={5} p={2} justifyContent="center" alignContent="center" >
                    <Grid item>
                        { process.env.REACT_APP_DEVELOPMENT_MODE !== 'true' ? 
                            <GoogleLogin
                                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                buttonText="LOGIN WITH GOOGLE"
                                onSuccess={this.onSuccessGoogle}
                                onFailure={this.onFailureGoogle}
                                cookiePolicy={'single_host_origin'}
                            /> :
                            <Button onClick={this.onTestButtonClick} startIcon={<LoginIcon/>} variant="contained">Log-in Development</Button>
                        }
                    </Grid>
                    <Grid item md={12}>
                        <Box m={3}>
                            <Typography textAlign="center" variant="subtitle2">
                                By logging in, you agree to our <Link href="/terms-of-service.html" target="blank" rel="noreferrer">Terms of Service</Link>, <Link href="/privacy-policy.html" target="blank" rel="noreferrer">Privacy Policy</Link>, and <Link href="/cookie-policy.html" target="blank" rel="noreferrer">Cookie Policy</Link>.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={12} m={3}>
                    <Typography variant="h2" textAlign="right">
                        "Anonymously express your views and beliefs with others through one-on-one 
                        chat"
                    </Typography>
                    <Typography variant="subtitle1" textAlign="right">
                        <MaterialLink component={Link} to={'/see/faq'}>Why the login? I thought this was supposed to be anonymous?</MaterialLink>
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

export default Landing;