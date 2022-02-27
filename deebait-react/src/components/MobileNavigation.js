import { useState } from 'react';
import { Link } from 'react-router-dom';

import StyleIcon from '@mui/icons-material/Style';
import ForumIcon from '@mui/icons-material/Forum';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

function MobileNavigation() {
    const [activeLink, setActiveLink] = useState('/' + window.location.pathname.split('/')[1]);

    function handleChangeLink(event, newLink) {
        setActiveLink(newLink);
    }

    return (
        <BottomNavigation sx={{width: '100%'}} value={activeLink} onChange={handleChangeLink} showLabels color="secondary">
            <BottomNavigationAction label="Opinions" value="/" icon={<StyleIcon/>} component={Link} to={'/'} />
            <BottomNavigationAction label="Debate" value="/debate" icon={<ForumIcon/>} component={Link} to={'/debate'} />
            <BottomNavigationAction label="Live" value="/live" icon={<VisibilityIcon/>} component={Link} to={'/live'}/>
            <BottomNavigationAction label="Settings" value="/settings" icon={<SettingsIcon/>} component={Link} to={'/settings'} />
        </BottomNavigation>
    );
}

export default MobileNavigation;