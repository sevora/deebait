import { Component } from 'react';
import axios from 'axios';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';

class Opinions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            topics: []
        }
    }

    static defaultProps = {
        headers: {},
        onSessionExpired: function() { return null; }
    }

    componentDidMount() {
        axios.get(process.env.REACT_APP_API_URL + '/user/topics/unanswered', { headers: this.props.headers })
        .then((response) => {
            this.setState({ topics: response.data.topics })
        }).catch((error) => {
            console.log(error.response);
        });
    }

    render() {
        return (
            <Container>
                { this.state.topics.map(topic => {
                    return (
                        <Box mb={3}>
                            <Card sx={{ maxWidth: 600 }}>
                                <CardActionArea>
                                    <CardContent>{topic.question}</CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Button>
                                        {topic.choices[0].choiceValue}
                                    </Button>
                                    <Button>
                                        {topic.choices[1].choiceValue}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Box>
                    )
                })}
            </Container>
        )
    }
}

export default Opinions;