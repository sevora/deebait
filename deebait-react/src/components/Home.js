import { Component } from 'react';

import Landing from './Landing.js';
import Dashboard from './Dashboard.js';

class Home extends Component {
    constructor(props) {
        super(props);

        this.onSuccessfulAuthentication = this.onSuccessfulAuthentication.bind(this);

        this.state = {
            hasToken: false
        }
    }

    onSuccessfulAuthentication(token) {
        localStorage.setItem('token', token);
    }

    componentDidMount() {
        if ( localStorage.getItem('token') ) {
            // add code to validate token server-side
            this.setState({ hasToken: true });
        }
    }

    render() {
        return (
            this.state.hasToken ? <Dashboard token={localStorage.getItem('token')} /> :  <Landing successfulAuthentication={this.onSuccessfulAuthentication} />
        );
    }
}

export default Home;