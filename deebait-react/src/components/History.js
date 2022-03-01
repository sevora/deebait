import { Component } from 'react';

class History extends Component {
    static defaultProps = {
        headers: {},
        onSessionExpired: function() { return null; },
        onAlert: function() { return null; }
    }

    render() {
        return (<div></div>);
    }
}

export default History;