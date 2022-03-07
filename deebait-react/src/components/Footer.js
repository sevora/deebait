/**
 * This contains credits for the creators of the website,
 * which is Ralph Louis Gopez as the developer
 * and Cy Wenvir Padillon for the design.
 */
import BrushIcon from '@mui/icons-material/Brush';
import CodeIcon from '@mui/icons-material/Code';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Footer() {
    return (
        <Grid container pt={1}>
            <Grid item xs={12} container direction="row" width="100%" justifyContent="center" alignItems="center" spacing={1} mt={1}>
                <Grid item sx={{lineHeight: '5px'}}>
                    <CodeIcon/>
                </Grid>
                <Grid item>
                    <Box width="100%" textAlign="center">
                        <Typography variant="body2">
                            Developed by Ralph Louis Gopez 
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid item xs={12} container direction="row" width="100%" justifyContent="center" alignItems="center" spacing={1}>
                <Grid item sx={{lineHeight: '5px'}}>
                    <BrushIcon/>
                </Grid>
                <Grid item>
                    <Box width="100%" textAlign="center">
                        <Typography variant="body2">
                            Designed by Cy Wenvir Padillon
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Footer