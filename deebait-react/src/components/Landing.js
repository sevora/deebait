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
                <Grid item container xs={12} md={8}>
                    <Grid item container m={5} mb={2} xs={12} alignItems="center" justifyContent="center">
                        <Grid item xs={12}>
                            <Typography variant="h2" textAlign="center">
                                &#60;deebait&#47;&#62;
                            </Typography>
                            <Typography variant="h4" textAlign="center">
                                The perfect place to argue.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Box mt={4} textAlign="center" sx={{ display: { md: 'none' } }}  mb={1}>
                                <Button onClick={this.buttonOnClick} startIcon={<TwitterIcon />} variant="contained">Log-in via Twitter</Button>
                                <Box mt={1}>
                                    <Typography textAlign="center" variant="subtitle2">
                                        By logging in, you agree to our Terms of Service, Privacy Policy, and Cookie Policy.
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item container m={2} mb={2} xs={12} columnSpacing={1} rowSpacing={3}>
                        <PaperGridItem xs={12} md={5} elevation={3} p={3}>
                            <AlignTextIcon variant="h5" icon={<LockIcon />}>Anonymous</AlignTextIcon>
                            Present your views, arguments, and beliefs freely 
                            without getting threatened in real-life. No personal 
                            information from the server is automatically sent to 
                            other users.
                        </PaperGridItem>
                        <PaperGridItem xs={12} md={7} elevation={3} p={3}>
                            <AlignTextIcon variant="h5" icon={<BookIcon />}>Organic</AlignTextIcon>
                            Debate about various issues and topics at hand,
                            and learn from or teach others. The community is 
                            well-moderated and bots, trolls or spammers are banned.
                            All message threads are deleted after 7 days of their
                            creation.
                        </PaperGridItem>
                        <PaperGridItem xs={12} md={7} elevation={3} p={3}>
                            <AlignTextIcon variant="h5" icon={<SportsMartialArtsIcon />}>Refreshing</AlignTextIcon>
                            Tired of having shallow conversations? Or having thirsty people trying to hook up with you
                            out of nowhere even though you're clearly not interested. You're in luck, cause this isn't 
                            a flirting site.
                        </PaperGridItem>
                        <PaperGridItem xs={12} md={5} elevation={3} p={3}>
                            <AlignTextIcon variant="h5" icon={<InsertEmoticonIcon />}>Fun</AlignTextIcon>
                            Just have fun expressing your opinions and getting to learn from each other's
                            perspective. 
                        </PaperGridItem>
                        {/* <PaperGridItem xs={12} md={6} elevation={3} p={3}>
                            <AlignTextIcon variant="h5" icon={<InsertEmoticonIcon />}>Fun</AlignTextIcon>
                            Anyone can tune in to two other people having a debate,
                            ofcourse everyone is anonymous including those in the debate,
                            and the audience can give points on the answer they prefer.
                        </PaperGridItem> */}
                    </Grid>
                </Grid>
                <Grid item container xs={12} md={4} p={2} backgroundColor="#7d7d7d" justifyContent="center" alignContent="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <Grid item>
                        <Button onClick={this.buttonOnClick} startIcon={<TwitterIcon />} variant="contained">Log-in via Twitter</Button>
                    </Grid>
                    <Grid item md={12}>
                        <Box m={3}>
                            <Typography textAlign="center" variant="subtitle2" sx={{color: '#fff'}}>
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