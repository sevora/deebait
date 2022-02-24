import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

function AlignTextIcon(props) {
    return (
        <Grid container direction="row" alignItems="center" spacing={1}>
            <Grid item>
                <Typography variant={props.variant} component={'span'}>{props.children}</Typography>
            </Grid>
            <Grid item>
                {props.icon}
            </Grid>
        </Grid>
    );
}

export default AlignTextIcon;