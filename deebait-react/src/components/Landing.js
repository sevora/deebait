import { Component } from 'react';
import axios from 'axios';

import TwitterIcon from '@mui/icons-material/Twitter';
import LockIcon from '@mui/icons-material/Lock';
import BookIcon from '@mui/icons-material/Book';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import PaperGridItem from './PaperGridItem.js';
import AlignTextIcon from './AlignTextIcon.js';

class Landing extends Component {
    constructor(props) {
        super(props);
        this.buttonOnClick = this.buttonOnClick.bind(this);
    }

    static defaultProps = {
        onSuccessfulAuthentication: function() { return null },
        onUnsuccessfulAuthentication: function() { return null },
    }

    buttonOnClick() {
        // add code to handle error when 
        axios.post(process.env.REACT_APP_API_URL + '/authentication/twitter', {}).then(response => {
            this.props.onSuccessfulAuthentication(response.data.token);
        }).catch(function(error) {
            this.props.onUnsuccessfulAuthentication(error);
        }.bind(this));
    }

    render() {
        return (
            <Grid container>
                <Grid item container xs={12} md={7} sx={{ minHeight: { xs: "70vh", md: "90vh" } }}>
                    <Grid item container xs={12} alignItems="center" justifyContent="center" height="100%">
                        <Grid item xs={12}>
                            <Typography variant="h2" textAlign="center">
                                &#60;deebait&#47;&#62;
                            </Typography>
                            <Typography variant="h4" textAlign="center">
                                The perfect place to argue.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={12} md={5} p={2} justifyContent="center" alignContent="center" >
                    <Grid item>
                        <Button onClick={this.buttonOnClick} startIcon={<TwitterIcon />} variant="contained">Log-in via Twitter</Button>
                    </Grid>
                    <Grid item md={12}>
                        <Box m={3}>
                            <Typography textAlign="center" variant="subtitle2">
                                By logging in, you agree to our Terms of Service, Privacy Policy, and Cookie Policy.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default Landing;