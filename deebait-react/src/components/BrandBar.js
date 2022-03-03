import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function BrandBar() {
    return (
        <AppBar position="relative" color="inherit" elevation={1}>
            <Toolbar variant="dense">
                <Typography variant="h6">
                    dee<Box color="primary.main" display="inline">bait</Box>
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default BrandBar;