import { Component } from 'react';
import { io } from 'socket.io-client';
import { Prompt } from 'react-router-dom';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Loader from './Loader.js';
import DebateQuip from './DebateQuip.js';
import DebateMessage from './DebateMessage.js';
import SendButton from './SendButton.js';
import EndButton from './EndButton.js';

class Debate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // differences: [{partnerChoice: 'Cats', yourChoice: 'Dogs'}],
            // messages: [{value: 'Hi', sender: 'user'}],
            differences: [],
            messages: [],
            disconnectMessage: 'Error on connection.',
            sureEnd: false,
            inputValue: '',
            connected: true,
            onQueue: true
        }

        this.onInputChange = this.onInputChange.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
        this.onEndConnection = this.onEndConnection.bind(this);
        this.onReconnect = this.onReconnect.bind(this);

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
        // uwu on send
        this.setState({ sureEnd: false });
    }

    onReconnect() {
        this.socket.connect();
    }

    onEndConnection() {
        if (this.state.sureEnd) {
            this.setState({ connected: false, disconnectMessage: "You've disconnected", sureEnd: false });
            this.socket.disconnect();
            return;
        } 
        this.setState({ sureEnd: true });
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
            this.setState({ connected: true, onQueue: true });
        });

        this.socket.on('has-partner', (data) => {
            // this.setState({ differences: data.differences, onQueue: false });
            this.setState({ connected: true, onQueue: false });
        });

        this.socket.on('partner-left', (data) => {
            this.setState({ connected: false, disconnectMessage: 'Your deeb match has left' });
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
                    <Loader visible={this.state.onQueue} />

                    {this.state.differences.map((difference, index) => {
                        return <DebateQuip key={'quip'+index} partnerChoice={difference.partnerChoice} userChoice={difference.userChoice}/>
                    })}

                    {this.state.messages.map((message, index) => {
                        return <DebateMessage key={'message' + index} isSender={message.sender === 'user'}>{message.value}</DebateMessage>
                    })}

                    {!this.state.connected &&
                    <Box width='100%' textAlign='center' sx={{ clear: 'both'}}>
                        <Typography sx={{marginBottom: '10px'}}>{this.state.disconnectMessage}. Want to match someone random again?</Typography>
                        <Button onClick={this.onReconnect} variant="outlined">Queue</Button>
                    </Box>}
                </Box>
                <TextField 
                    disabled={this.state.onQueue}
                    value={this.state.inputValue}
                    onChange={this.onInputChange}
                    placeholder="Enter message here..." 
                    InputProps={{ startAdornment: <EndButton onClick={this.onEndConnection} value={this.state.sureEnd ? 'Sure?' : 'End'} disabled={this.state.onQueue} />, endAdornment: <SendButton onClick={this.onSendMessage} disabled={this.state.onQueue} />}}
                    fullWidth
                />
            </Box>
        );
    }
}

export default Debate;