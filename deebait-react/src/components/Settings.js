import { Component } from 'react';

class Settings extends Component {
    static defaultProps = {
        headers: {},
        onSessionExpired: function() { return null; },
        onAlert: function() { return null; }
    }

    render() {
        return (<div></div>);
    }
}

export default Settings;