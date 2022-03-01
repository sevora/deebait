import { Component } from 'react';
import { io } from 'socket.io-client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

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
                <Box sx={{height: '70vh', overflowY: 'auto', mb: '10px' }}>
                    <Box sx={{ width: '100%'}} mb={1}>
                        <Alert severity='error'>This person prefers 'Cats' over 'Dogs'</Alert>
                    </Box>

                    <Box sx={{ width: '100%'}} mb={1}>
                        <Alert severity='error'>This person is a 'Top' not a 'Bottom'</Alert>
                    </Box>

                    <Box sx={{ width: '100%' }} mb={1}>
                        <Box p={1} mt={1} borderRadius={2} sx={{ clear: 'both', float: 'left', backgroundColor: '#ddd', display: 'inline-block'}}>
                            <Typography variant="body1">
                                Bruh, dogs suck.
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ width: '100%' }} mb={1}>
                        <Box p={1} mt={1} borderRadius={2} sx={{ clear: 'both', float: 'right', backgroundColor: '#ff1744', color: 'white', display: 'inline-block'}}>
                            <Typography variant="body1">
                                Says the pussy on top.
                            </Typography>
                        </Box>
                    </Box>
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