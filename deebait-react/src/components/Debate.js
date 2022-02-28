import { Component } from 'react';
import { io } from 'socket.io-client';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import SendButton from './SendButton.js';

class Debate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: []
        }

        this.socket = null;
    }

    static defaultProps = {
        headers: {},
        onSessionExpired: function() { return null; }
    }

    componentDidMount() {
        this.socket = io(process.env.REACT_APP_API_URL + '/chat', {
            withCredentials: true,
            extraHeaders: {
                // adding a custom header called headers
                deebaitheader: JSON.stringify(this.props.headers)
            }
        });

        this.socket.on('connect', (data) => {
            
        });  

        this.socket.on('has-partner', (data) => {
           
        });

        this.socket.on('partner-left', (data) => {
           
        });
    }

    componentWillUnmount() {
        this.socket.disconnect();
        this.socket = null;
    }

    render() {
        return (
            <Box>
                <Box sx={{height: '70vh'}}>

                </Box>
                <TextField 
                    style={{borderRadius: '100px'}}
                    placeholder="Enter message here..." 
                    InputProps={{ endAdornment: <SendButton />}}
                    fullWidth
                />
            </Box>
        );
    }
}

export default Debate;