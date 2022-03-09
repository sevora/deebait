import WhatshotIcon from '@mui/icons-material/Whatshot';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

function OpinionCard({ question='Question here?', choiceA='Choice A', choiceB='Choice B', width=800, onClick=() => {return null;}, limitedTime=false }) {    
    return (
        <Card elevation={10} sx={{ minWidth: { 'md': width }, marginRight: '10px' }}>
            <CardActionArea sx={{ paddingTop: '10px', display: limitedTime ? 'block' : 'none' }}>
                <Tooltip title="Trending topics are limited time. They will be removed after some time.">
                    <Box width="100%" sx={{ textAlign: { xs: 'right', md: 'left' } }}>
                        <Box display="inline-block" padding="10px" borderRadius="15px">
                            <Typography variant="h4" color="primary.main">
                                <WhatshotIcon fontSize='inherit'/> Trending
                            </Typography>

                            <Typography variant="h2" color="primary.main" sx={{ display: {xs: 'block', md: 'none'} }}>
                                Limited Time
                            </Typography>
                        </Box>
                    </Box>
                </Tooltip>
            </CardActionArea>
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