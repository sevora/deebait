import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CodeIcon from '@mui/icons-material/Code';

function Footer(props) {
    return (
        <Grid container direction="row" width="100%" justifyContent="center" alignItems="center" spacing={1}>
            <Grid item>
                <CodeIcon/>
            </Grid>
            <Grid item>
                <Box width="100%" textAlign="center" pt={1} pb={1}>
                    <Typography variant="body2">
                        {props.children}
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    );
}

export default Footer