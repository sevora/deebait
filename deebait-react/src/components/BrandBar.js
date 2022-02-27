import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function BrandBar() {
    return (
        <AppBar position="relative" color="inherit">
            <Toolbar variant="dense">
                <Typography variant="h6">&#60;deebait&#47;&#62;</Typography>
            </Toolbar>
        </AppBar>
    );
}

export default BrandBar;