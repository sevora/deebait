import { Component } from "react";

import Drawer from '@mui/material/Drawer';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Grid from '@mui/material/Grid';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            header: this.props.token ? { Authorization: `Bearer ${this.props.token}`} : {}
        }
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <div>
                <Drawer variant="permanent" anchor="left" 
                    sx={
                        {
                            width: 240, 
                            flexShrink: 0, 
                            '& .MuiDrawer-paper': {
                                width: 240,
                                boxSizing: 'border-box',
                            } 
                        }
                    }>
                    <List>
                        <ListItem button key={"Hey"}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText primary={"Hey"} />
                        </ListItem>
                    </List>
                </Drawer>
            </div>
        );
    }
}

export default Dashboard;