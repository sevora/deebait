import { Component } from 'react';

class Live extends Component {
    static defaultProps = {
        headers: {},
        onSessionExpired: function() { return null; }
    }

    render() {
        return (<div></div>);
    }
}

export default Live;