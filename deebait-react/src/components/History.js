import { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Copied from stackoverflow. Link to the source
 * https://stackoverflow.com/questions/9763441/milliseconds-to-time-in-javascript
 * @param {*} s 
 * @returns 
 */
function msToTime(s) {
    // Pad to 2 or 3 digits, default is 2
    function pad(n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
    }

    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    s = (s - mins) / 60;
    // modified it a bit to include days lol
    let hrs = s % 24;
    s = (s - hrs) / 24;
    let days = s % 24;

    return pad(days) + ':' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}
  
function formattedDateDifference(date1, date2) {
    // Discard the time and time-zone information.
    let milliseconds = Math.abs(date1 - date2);
    return msToTime(milliseconds);
    // return `${Math.floor(days)}:${Math.floor(hours)}:${Math.floor(minutes)}:${Math.floor(seconds)}`;
}


class History extends Component {
    constructor(props) {
        super(props);

        this.state = {
            threads: [],
            currentDate: new Date()
        }

        this.timeInterval = null;
        this.errorHandler = this.errorHandler.bind(this);
    }

    static defaultProps = {
        headers: {},
        onSessionExpired: function() { return null; },
        onAlert: function() { return null; }
    }

    componentDidMount() {
        axios.get(process.env.REACT_APP_API_URL + '/user/threads/past', { headers: this.props.headers })
        .then((response) => {
            let threads = response.data.threads.map(thread => {
                thread.expiresAt = addDays(thread.createdAt, 7);
                return thread;
            });

            this.setState({ threads });
        }).catch(this.errorHandler);

        this.timeInterval = setInterval(() => {
            this.setState({ currentDate: new Date() });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timeInterval);
        this.timeInterval = null;
    }

    errorHandler(error) {
        if (error.response && error.response.data.title === 'InvalidUser') this.props.onSessionExpired();
    }
    
    render() {
        return (
            <Box>
                <Box ml={2} mr={2} pb={1}>
                    <Typography variant="h2">Past Threads</Typography>
                    <Typography variant="body">Click on one to view. A thread is deleted 7 days after its creation.</Typography>
                </Box>
                <List>
                    <Divider/>
                    {this.state.threads.map((thread, index) => {
                        return (
                            <ListItem 
                                button 
                                divider 
                                key={index} 
                                component={Link} 
                                to={`/history/view/${thread.threadID}`}
                            >
                                <ListItemText 
                                    primary={thread.threadID} 
                                    secondary={`Expires after: ${formattedDateDifference(this.state.currentDate, thread.expiresAt)}`} 
                                />
                            </ListItem>
                        )
                    })}

                </List>
            </Box>
        );
    }
}

export default History;