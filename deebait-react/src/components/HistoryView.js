import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import DebateMessage from './DebateMessage.js';

class HistoryView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            createdAt: new Date()
        }
    }

    static defaultProps = {
        headers: {},
        onSessionExpired: function() { return null; },
        onAlert: function() { return null; }        
    }

    componentDidMount() {
        axios.post(process.env.REACT_APP_API_URL + '/user/threads/view', { threadID: this.props.match.params.id }, { headers: this.props.headers })
        .then((response) => { 
            const { messages, createdAt } = response.data.thread;
            let localDate = new Date(createdAt)
            this.setState({ messages, createdAt: localDate });
        })
        .catch(error => {

        });
    }

    render() {
        return (
            <Box>
                <Box mb={1}>
                    <Alert severity='warning'>This is a preview of a thread created last {this.state.createdAt.toString()}</Alert>
                </Box>
                
                {this.state.messages.map((message, index) => {
                    return <DebateMessage key={'message' + index} isSender={message.sender === 'user'}>{message.messageValue}</DebateMessage>
                })}

                <Box pt={2} sx={{ clear: 'both' }}>
                    <Alert severity='success'>End of thread.</Alert>
                </Box>
            </Box>
        );
    }
}

export default withRouter(HistoryView);