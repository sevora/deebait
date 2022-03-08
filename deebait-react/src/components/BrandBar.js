import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

function BrandBar() {
    return (
        <AppBar position="relative" color="inherit" elevation={1}>
            <Toolbar variant="dense">
                <img alt="Deebait" src={`${process.env.PUBLIC_URL}/images/Logo_Small.svg`} style={{ width: 'auto', height: '30px' }} />
            </Toolbar>
        </AppBar>
    );
}

export default BrandBar;