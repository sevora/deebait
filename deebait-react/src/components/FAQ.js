import { Component } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

class FAQ extends Component {
    static defaultProps = {
        headers: {},
        onSessionExpired: function() { return null; },
        onAlert: function() { return null; }
    }

    render() {
        return (
            <Grid container>
                <Grid item mb={3} xs={12}>
                    <Typography variant="h2">Frequently Asked Questions</Typography>
                </Grid>
                <Grid item xs={12} mb={3}>
                    <Typography variant="h4">Why do I have to log-in to use the website?</Typography>
                    <Box mt={2} textAlign="justify">
                        <strike>Cause I said so.</strike> This is mainly to deter spamming behaviour as 
                        the implementation of an account system would mean that moderators would be able to 
                        ban by user instead of banning by IP address. Banning by IP is not reliable when
                        targeting a single user and could make it harder for people who shouldn't have been banned
                        to access the site when the IP address they're using is banned.
                    </Box>
                </Grid>
                <Grid item xs={12} mb={3}>
                    <Typography variant="h4">Am I really anonymous?</Typography>
                    <Box mt={2} textAlign="justify">
                        We only need log-in to identify that you're a valid user and be able to ban you <b>if and only if you are 
                        a spammer.</b> Under the hood, or more like, in our servers, when debating, we don't give back information to the client
                        about who they're interacting with in an explicit manner other than sending the conflicting answers to questions they've set 
                        beforehand and also passing along the messages from client-to-client. Ofcourse, if you send real information about you 
                        while talking to someone else in the site, we can't stop that.
                    </Box>
                </Grid>
                <Grid item xs={12} mb={3}>
                    <Typography variant="h4">Will users who talk about controversial issues, or resort to profanity, or have extreme views be banned?</Typography>
                    <Box mt={2} textAlign="justify">
                        <b>Long story short: Nope.</b> This is a place where people can freely share their opinions anonymously. We don't actually 
                        watch every user's actions rather we periodically run a script that figures out from thread's who the spammers are 
                        and then a moderator can verify if the user is spamming or is just using their favorite line as an introduction message
                        every time. It's not a crime to have your own opinions.
                    </Box>
                </Grid>
            </Grid>
        );
    }
}

export default FAQ;