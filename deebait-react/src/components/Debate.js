import { Component } from 'react';
import { io } from "socket.io-client";

class Debate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            socket: io(process.env.REACT_APP_API_URL, {
                withCredentials: true,
                extraHeaders: {
                    // adding a custom header called headers
                    deebaitheader: JSON.stringify(this.props.headers)
                }
            })
        }
    }

    static defaultProps = {
        headers: {},
        onSessionExpired: function() { return null; }
    }

    componentDidMount() {
        let { socket } = this.state;

        socket.on('connect', function() {
            socket.send('Hi!');
        });

    }
    render() {
        return (
            <div></div>
        );
    }
}

export default Debate;