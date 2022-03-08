import { useState } from 'react';
import { Link } from 'react-router-dom';

import StyleIcon from '@mui/icons-material/Style';
import ForumIcon from '@mui/icons-material/Forum';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';

import Drawer from '@mui/material/Drawer';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

function DesktopNavigation({ sx={} }) {
    let links = ['Opinions', 'Debate', 'History', 'Settings'];
    let indexOfCurrentLink = getCurrentIndex();
    let [selectedLinkIndex, setSelectedLinkIndex] = useState(indexOfCurrentLink);
    let icons = [<StyleIcon />, <ForumIcon />, <HistoryIcon />, <SettingsIcon />];

    function getCurrentIndex() {
        if (window.location.pathname === '/') return 0; // this is to return the right index for opinions page which is at '/'
        return links.indexOf( capitalizeFirstLetter(window.location.pathname.split('/')[1]) );
    }

    function handleChangeLink(index) {
        let pastIndex = selectedLinkIndex;
        setSelectedLinkIndex(index);

        // sets the active link to the right one
        setTimeout(() => {
            if ( getCurrentIndex() !== index ) setSelectedLinkIndex(pastIndex);
        }, 100);
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <Drawer variant="permanent" anchor="left" sx={sx}>    
            <List>
                <ListItem style={{justifyContent:'center'}}>
                    <img alt="Deebait" src={`${process.env.PUBLIC_URL}/images/Logo_Small.svg`} style={{ width: 'auto', height: '30px' }} />
                </ListItem>
                {
                    links.map((link, index) => {
                        let url = '/' + link.toLowerCase();
                        return (
                            <ListItem button key={link} component={Link} onClick={() => handleChangeLink(index)} to={link === 'Opinions' ? '/' : url} selected={selectedLinkIndex === index}>
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