import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CodeIcon from '@mui/icons-material/Code';

function Footer() {
    return (
        <Grid container direction="row" width="100%" justifyContent="center" alignItems="center" spacing={1} mt={1}>
            <Grid item sx={{lineHeight: '5px'}}>
                <CodeIcon/>
            </Grid>
            <Grid item>
                <Box width="100%" textAlign="center" pt={1} pb={1}>
                    <Typography variant="body2">
                        Developed by Ralph Louis Gopez
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    );
}

export default Footer