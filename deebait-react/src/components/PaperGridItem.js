import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function PaperGridItem(props) {
    return (
        <Grid item xs={props.xs} md={props.md}>
            <Paper elevation={props.elevation}>
                <Box p={props.p}>
                    <Typography variant="body1" component={'div'}>
                        {props.children}
                    </Typography>
                </Box>
            </Paper>
        </Grid>
    );
}

export default PaperGridItem;