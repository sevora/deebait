import { Component } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

class Settings extends Component {
    constructor(props) {
        super(props);

        this.onClickLogOut = this.onClickLogOut.bind(this);
    }
    
    static defaultProps = {
        headers: {},
        onSessionExpired: function() { return null; },
        onAlert: function() { return null; }
    }

    onClickLogOut() {
        this.props.onSessionExpired();
    }

    render() {
        return (
            <Box>
                <Box mb={2}>
                    <Typography variant="h2">Settings</Typography>
                </Box>
            
                <List>
                    <Divider/>
                    <ListItem button divider onClick={this.onClickLogOut}>
                        <ListItemText 
                            primary='Log Out'
                            secondary='Click to log out of the web application.'
                        />
                    </ListItem>

                </List>
            </Box>
        );
    }
}

export default Settings;