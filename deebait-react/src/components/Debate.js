import { Component } from 'react';
import { io } from "socket.io-client";

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
            console.log('Yo I got connected!');
        });  

        this.socket.on('has-partner', (data) => {
           console.log('Yo I found a partner');
        });

        this.socket.on('has-left', (data) => {
            console.log('Yo my partner left me...');
         });
    }

    componentWillUnmount() {
        this.socket.disconnect();
        this.socket = null;
    }

    render() {
        return (
            <div></div>
        );
    }
}

export default Debate;