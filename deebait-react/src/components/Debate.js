import { Component } from 'react';
import { io } from 'socket.io-client';
import { Prompt } from 'react-router-dom';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import DebateQuip from './DebateQuip.js';
import DebateMessage from './DebateMessage.js';
import SendButton from './SendButton.js';

class Debate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // differences: [{partnerChoice: 'Cats', yourChoice: 'Dogs'}],
            // messages: [{value: 'Hi', sender: 'user'}],
            differences: [],
            messages: [],
            inputValue: '',
            connected: true,
            onQueue: true
        }

        this.onInputChange = this.onInputChange.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);

        this.socket = null;
    }

    static defaultProps = {
        headers: {},
        onSessionExpired: function() { return null; },
        onAlert: function() { return null; }
    }

    onInputChange(event) {
        this.setState({ inputValue: event.target.value });
    }

    onSendMessage() {

    }

    componentDidMount() {
        // this.props.router.setRouteLeaveHook(this.props.route, () => {
        //     return 'You will be disconnected once you leave this page.'
        //   });

        this.socket = io(process.env.REACT_APP_API_URL + '/chat', {
            withCredentials: true,
            extraHeaders: {
                // adding a custom header called headers
                deebaitheader: JSON.stringify(this.props.headers)
            }
        });

        this.socket.on('connect', (data) => {
            this.setState({ connected: true });
        });

        this.socket.on('has-partner', (data) => {
            this.setState({ differences: data.differences, onQueue: false });
        });

        this.socket.on('partner-left', (data) => {
           
        });
    }

    componentWillUnmount() {
        this.socket.disconnect();
    }

    render() {
        return (
            <Box>
                <Prompt message="You will be disconnected when you leave the page."/>
                <Box sx={{height: '70vh', overflowY: 'auto', mb: '10px' }}>
                    {this.state.differences.map((difference, index) => {
                        return <DebateQuip key={'quip'+index} partnerChoice={difference.partnerChoice} userChoice={difference.userChoice}/>
                    })}

                    {this.state.messages.map((message, index) => {
                        return <DebateMessage key={'message' + index} isSender={message.sender === 'user'}>{message.value}</DebateMessage>
                    })}

                    {!this.state.connected &&
                    <Box width='100%' textAlign='center'>
                        <Typography>The deeb you've matched with has left. Want to try again?</Typography>
                        <Button variant="outlined">Reconnect</Button>
                    </Box>}
                </Box>
                <TextField 
                    value={this.state.inputValue}
                    onChange={this.onInputChange}
                    style={{borderRadius: '100px'}}
                    placeholder="Enter message here..." 
                    InputProps={{ endAdornment: <SendButton onClick={this.onSendMessage} />}}
                    fullWidth
                />
            </Box>
        );
    }
}

export default Debate;