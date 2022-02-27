import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function PaperGridItem({ xs='12', md='6', elevation='3', p='3', children }) {
    return (
        <Grid item xs={xs} md={md}>
            <Paper elevation={elevation} sx={{ minHeight: { md: '200px'} }}>
                <Box p={p}>
                    <Typography variant="body1" component={'div'}>
                        {children}
                    </Typography>
                </Box>
            </Paper>
        </Grid>
    );
}

export default PaperGridItem;