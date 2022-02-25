import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

function AlignTextIcon({ variant='body1', icon=<div></div>, children }) {
    return (
        <Grid container direction="row" alignItems="center" spacing={1}>
            <Grid item>
                <Typography variant={variant} component={'span'}>{children}</Typography>
            </Grid>
            <Grid item>
                {icon}
            </Grid>
        </Grid>
    );
}

export default AlignTextIcon;