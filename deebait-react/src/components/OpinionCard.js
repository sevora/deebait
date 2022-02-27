import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

function OpinionCard({ question='Question here?', choiceA='Choice A', choiceB='Choice B', width=800, onClick=() => {return null;} }) {
    return (
        <Card elevation={10} sx={{ minWidth: { 'md': width }, marginRight: '10px' }}>
            <CardActionArea>
                <CardContent>
                    <Typography variant="body1">
                        {question}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Grid container>
                    <Grid item xs={12} md={5} textAlign="left">
                        <Button variant="contained" sx={{width: '100%'}} onClick={() => onClick(choiceA)}>
                            {choiceA}
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={2} textAlign="center">
                        <Button variant="text" onClick={() => onClick(null)}>
                            Skip
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={5} textAlign="right">
                        <Button variant="contained" sx={{width: '100%'}} onClick={() => onClick(choiceB)}>
                            {choiceB}
                        </Button>
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
}

export default OpinionCard;