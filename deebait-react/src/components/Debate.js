/**
 * This is the Debate Page where sockets are used
 * to connect client-server-client in real-time.
 * The process goes like this, client connects either gets queued up or matched.
 * On match, client can send messages to the server and server passes that message to 
 * the right client.
 */
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

    /**
     * 
     */
    removeTypingTimeout() {
        this.isTyping = false;
        this.socket.emit('not-typing');
    }

    /**
     * This code runs whenever the input is changed.
     * @param event This is an input change event
     */
    onInputChange(event) {
        if (event.target.value.length <= 250) {
            this.setState({ inputValue: event.target.value, sureEnd: false });

            /**
             * When the user types and they aren't emitting the is typing yet,
             * then emit it and set it as is typing otherwise we want to 
             * make the is-typing event longer by preventing the removeTypingIndex
             * code from running.
             */
            if (!this.isTyping) {
                this.isTyping = true;
                this.socket.emit('is-typing');
            } else {
                clearTimeout(this.removeTypingIndex);
            }

            this.removeTypingIndex = setTimeout(this.removeTypingTimeout, 1000);

        }
    }

    /**
     * This code runs for every keypress but only does its job when 
     * Enter is clicked.
     * @param event A Keypress Event.
     */
    onClickEnter(event) {
        if (event.charCode === 13) {
            this.onSendMessage();
        }
    }

    /**
     * You know there are two ways the message send action is done, 
     * either by clicking the send button or clicking enter on keyboard.
     * That's why I did this.
     */
    onSendMessage() {
        if (this.state.connected && !this.state.onQueue && this.state.inputValue.trim().length > 0) {
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
        /**
         * Connects the socket with the header
         */
        this.socket = io(process.env.REACT_APP_API_URL + '/chat', {
            withCredentials: true,
            extraHeaders: {
                // adding a custom header called headers
                deebaitheader: JSON.stringify(this.props.headers)
            }
        });

        /**
         * On connect, server automatically adds user to queue.
         * Thus we want to show the onQueue loader animation.
         */
        this.socket.on('connect', () => {
            this.props.onAlert({ title: 'On Queue', text: 'You have been queued for matching. Please wait.', severity: 'warning' });
            this.setState({ differences: [], messages: [], connected: true, onQueue: true });
        });

        /**
         * 
         */
        this.socket.on('has-partner', (data) => {
            this.props.onAlert({ title: 'Match Found', text: 'You have been matched!', severity: 'success' });
            this.setState({ differences: data.differences, onQueue: false, connected: true });
        });

        /**
         * This is when the partner has a message, and 
         * this client should receive a message.
         */
        this.socket.on('has-message', (data) => {
            let messages = this.state.messages.concat([{ value: data.message, sender: 'partner' }]);
            this.setState({ messages }, () => {
                this.messagesEnd.scrollIntoView({ behavior: "smooth" });
            });
        });

        /**
         * This is necessary to make sure the order of messages
         * is proper. We only add a message to DOM as long as it is 
         * confirmed that the partner has received it.
         */
        this.socket.on('was-sent-to-partner', (data) => {
            let messages = this.state.messages.concat([{ value: data.message, sender: 'user' }]);
            this.setState({ messages, inputValue: '' }, () => {
                this.messagesEnd.scrollIntoView({ behavior: "smooth" });
            });
        });

        /**
         * This is for the X is typing feature.
         */
        this.socket.on('is-partner-typing', () => {
            this.setState({ isPartnerTyping: true });
        });

        /**
         * This is for the X is typing feature.
         * Not typing gets sent 5 seconds after a typing 
         * message is not received.
         */
        this.socket.on('is-partner-not-typing', () => {
            this.setState({ isPartnerTyping: false });
        });

        /**
         * When the partner leaves, both the client and the partner
         * are disconnected. They are not automatically added back to queue,
         * will only be added back to queue when they click the queue again button
         * or reopen the Debate Page.
         */
        this.socket.on('partner-left', (data) => {
            this.setState({ connected: false, isPartnerTyping: false, disconnectMessage: 'Your deeb match has left' }, () => {
                this.messagesEnd.scrollIntoView({ behavior: "smooth" });
            });
        });

        /**
         * Automatically log the user out on session expiry
         */
        this.socket.on('log-out', () => {
            this.props.onSessionExpired();
        });

    }

    /**
     * We want to disconnect the socket when they switch pages because
     * it won't work properly if we don't do that.
     */
    componentWillUnmount() {
        this.socket.disconnect();
        this.socket = null;
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
                        <img alt="Deeb is typing" src="images/triple-dot.gif" style={{width: '100%', height: '12px', objectFit: 'cover' }} />
                    </DebateMessage>}

                    {!this.state.connected &&
                    <Box width='100%' textAlign='center' sx={{ clear: 'both'}}>
                        <Typography sx={{  paddingTop: '12px', marginBottom: '10px'}}>{this.state.disconnectMessage}. Want to match someone random again?</Typography>
                        <Button onClick={this.onReconnect} variant="outlined">Queue</Button>
                    </Box>}

                    <div style={{ float:"left", clear: "both" }} ref={(element) => { this.messagesEnd = element; }}></div>
                </Box>
                <Box>
                    <TextField 
                        disabled={this.state.onQueue || !this.state.connected}
                        value={this.state.inputValue}
                        onChange={this.onInputChange}
                        onKeyPress={this.onClickEnter}
                        placeholder="Enter message here..." 
                        InputProps={{ 
                            startAdornment: <EndButton onClick={this.onEndConnection} value={this.state.sureEnd ? 'Sure?' : 'End'} disabled={this.state.onQueue || !this.state.connected} />, 
                            endAdornment: <SendButton onClick={this.onSendMessage} disabled={this.state.onQueue || !this.state.connected} />,
                            autoComplete: 'off'
                        }}
                        fullWidth
                    />
                </Box>
            </Box>
        );
    }
}

export default Debate;