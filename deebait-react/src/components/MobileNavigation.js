import { useState } from 'react';
import { Link } from 'react-router-dom';

import StyleIcon from '@mui/icons-material/Style';
import ForumIcon from '@mui/icons-material/Forum';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

function MobileNavigation() {
    const [activeLink, setActiveLink] = useState( getCurrentPath() );

    function getCurrentPath() {
        return '/' + window.location.pathname.split('/')[1]
    }

    function handleChangeLink(event, newLink) {
        let pastLink = activeLink;
        setActiveLink(newLink);
        
        // prevents activating the wrong link
        setTimeout(() => {
            if (getCurrentPath() !== newLink) {
                setActiveLink(pastLink);
            }
        }, 100)
    }

    return (
        <BottomNavigation sx={{ width: '100%' }} value={activeLink} onChange={handleChangeLink} showLabels color="secondary">
            <BottomNavigationAction label="Opinions" value="/" icon={<StyleIcon/>} component={Link} to={'/'} />
            <BottomNavigationAction label="Debate" value="/debate" icon={<ForumIcon/>} component={Link} to={'/debate'} />
            <BottomNavigationAction label="History" value="/history" icon={<HistoryIcon/>} component={Link} to={'/history'} />
            <BottomNavigationAction label="Settings" value="/settings" icon={<SettingsIcon/>} component={Link} to={'/settings'} />
        </BottomNavigation>
    );
}

export default MobileNavigation;