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
            // differences: [{partnerAnswer: 'Cats', answer: 'Dogs'}],
            // messages: [{value: 'Hi', sender: 'user'}],
            differences: [],
            messages: [],
            
            disconnectMessage: 'Error on connection.',

            inputValue: '',

            sureEnd: false,
            connected: true,
            onQueue: true,
            isPartnerTyping: false
        }

        this.isTyping = false;
        this.removeTypingTimeout = this.removeTypingTimeout.bind(this);
        this.removeTypingIndex = null;

        this.onInputChange = this.onInputChange.bind(this);
        this.onClickEnter = this.onClickEnter.bind(this);
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

    removeTypingTimeout() {
        this.isTyping = false;
        this.socket.emit('not-typing');
    }

    onInputChange(event) {
        if (event.target.value.length <= 250) {
            this.setState({ inputValue: event.target.value, sureEnd: false });

            if (!this.isTyping) {
                this.isTyping = true;
                this.socket.emit('is-typing');
            } else {
                clearTimeout(this.removeTypingIndex);
            }

            this.removeTypingIndex = setTimeout(this.removeTypingTimeout, 1000);

        }
    }

    onClickEnter(event) {
        if (event.charCode === 13) {
            this.onSendMessage();
        }
    }

    onSendMessage() {
        if (this.state.connected && !this.state.onQueue) {
            this.socket.emit('send-to-partner', { message: this.state.inputValue });
        }
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

        this.socket.on('connect', () => {
            this.setState({ differences: [], messages: [], connected: true, onQueue: true });
        });

        this.socket.on('has-partner', (data) => {
            this.setState({ differences: data.differences, onQueue: false, connected: true });
        });

        this.socket.on('has-message', (data) => {
            let messages = this.state.messages.concat([{ value: data.message, sender: 'partner' }]);
            this.setState({ messages }, () => {
                this.messagesEnd.scrollIntoView({ behavior: "smooth" });
            });
        });

        this.socket.on('was-sent-to-partner', (data) => {
            let messages = this.state.messages.concat([{ value: data.message, sender: 'user' }]);
            this.setState({ messages, inputValue: '' }, () => {
                this.messagesEnd.scrollIntoView({ behavior: "smooth" });
            });
        });

        this.socket.on('is-partner-typing', () => {
            this.setState({ isPartnerTyping: true });
        });

        this.socket.on('is-partner-not-typing', () => {
            this.setState({ isPartnerTyping: false });
        });
        
        this.socket.on('partner-left', (data) => {
            // this.socket.disconnect();
            this.setState({ connected: false, isPartnerTyping: false, disconnectMessage: 'Your deeb match has left' }, () => {
                this.messagesEnd.scrollIntoView({ behavior: "smooth" });
            });
        });
        // add is typing thing
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
                        return <DebateQuip key={'quip'+index} question={difference.question} partnerChoice={difference.partnerAnswer} yourChoice={difference.answer}/>
                    })}

                    {this.state.messages.map((message, index) => {
                        return <DebateMessage key={'message' + index} isSender={message.sender === 'user'}>{message.value}</DebateMessage>
                    })}

                    { this.state.isPartnerTyping && 
                    <DebateMessage>
                        <img src="images/triple-dot.gif" style={{width: '100%', height: '12px', objectFit: 'cover' }} />
                    </DebateMessage>}

                    {!this.state.connected &&
                    <Box width='100%' textAlign='center' sx={{ clear: 'both'}}>
                        <Typography sx={{  paddingTop: '12px', marginBottom: '10px'}}>{this.state.disconnectMessage}. Want to match someone random again?</Typography>
                        <Button onClick={this.onReconnect} variant="outlined">Queue</Button>
                    </Box>}

                    <div style={{ float:"left", clear: "both" }} ref={(element) => { this.messagesEnd = element; }}></div>
                </Box>
                <TextField 
                    disabled={this.state.onQueue || !this.state.connected}
                    value={this.state.inputValue}
                    onChange={this.onInputChange}
                    onKeyPress={this.onClickEnter}
                    placeholder="Enter message here..." 
                    InputProps={{ startAdornment: <EndButton onClick={this.onEndConnection} value={this.state.sureEnd ? 'Sure?' : 'End'} disabled={this.state.onQueue || !this.state.connected} />, endAdornment: <SendButton onClick={this.onSendMessage} disabled={this.state.onQueue || !this.state.connected} />}}
                    fullWidth
                />
            </Box>
        );
    }
}

export default Debate;