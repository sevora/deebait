import { Link } from 'react-router-dom';

import StyleIcon from '@mui/icons-material/Style';
import ForumIcon from '@mui/icons-material/Forum';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HistoryIcon from '@mui/icons-material/History';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';

import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

function DesktopNavigation(props) {
    return (
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
                <ListItem style={{justifyContent:'center'}}>
                    <Typography variant="h5">
                        &#60;deebait&#47;&#62;
                    </Typography>
                </ListItem>

                <ListItem button key={"Opinions"} component={Link} to={'/'}>
                    <ListItemIcon><StyleIcon /></ListItemIcon>
                    <ListItemText primary={"Opinions"} />
                </ListItem>

                <ListItem button key={"Debate"} component={Link} to={'/debate'}>
                    <ListItemIcon><ForumIcon /></ListItemIcon>
                    <ListItemText primary={"Debate"} />
                </ListItem>

                <ListItem button key={"Watch Live"}>
                    <ListItemIcon><VisibilityIcon /></ListItemIcon>
                    <ListItemText primary={"Watch Live"} />
                </ListItem>

                <ListItem button key={"History"}>
                    <ListItemIcon><HistoryIcon /></ListItemIcon>
                    <ListItemText primary={"History"} />
                </ListItem>

                <ListItem button key={"FAQ"}>
                    <ListItemIcon><HelpIcon /></ListItemIcon>
                    <ListItemText primary={"FAQ"} />
                </ListItem>

                <ListItem button key={"Settings"}>
                    <ListItemIcon><SettingsIcon /></ListItemIcon>
                    <ListItemText primary={"Settings"} />
                </ListItem>
            </List>
        </Drawer>
    );
}

export default DesktopNavigation;