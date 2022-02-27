import { useState } from 'react';
import { Link } from 'react-router-dom';

import StyleIcon from '@mui/icons-material/Style';
import ForumIcon from '@mui/icons-material/Forum';
import HistoryIcon from '@mui/icons-material/History';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';

import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

function DesktopNavigation({ sx={} }) {
    let links = ['Opinions', 'Debate', 'History', 'FAQ', 'Settings'];
    let indexOfCurrentLink = links.indexOf(capitalizeFirstLetter(window.location.pathname.split('/')[1]));
    let [selectedLinkIndex, setSelectedLinkIndex] = useState(indexOfCurrentLink);
    let icons = [<StyleIcon />, <ForumIcon />, <HistoryIcon />, <HelpIcon />, <SettingsIcon />];

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <Drawer variant="permanent" anchor="left" sx={sx}>    
            <List>
                <ListItem style={{justifyContent:'center'}}>
                    <Typography variant="h5">
                        &#60;deebait&#47;&#62;
                    </Typography>
                </ListItem>
                {
                    links.map((link, index) => {
                        let url = '/' + link.toLowerCase();
                        return (
                            <ListItem button key={link} component={Link} onClick={() => setSelectedLinkIndex(index)} to={link === 'Opinions' ? '/' : url} selected={selectedLinkIndex === index}>
                                <ListItemIcon>{icons[index]}</ListItemIcon>
                                <ListItemText primary={link} />
                            </ListItem>   
                        )
                    })
                }
            </List>
        </Drawer>
    );
}

export default DesktopNavigation;