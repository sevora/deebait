import { Component } from 'react';

class FAQ extends Component {
    static defaultProps = {
        headers: {},
        onSessionExpired: function() { return null; },
        onAlert: function() { return null; }
    }

    render() {
        return (<div></div>);
    }
}

export default FAQ;