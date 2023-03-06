/**
 * This is the opinions dashboard.
 */
import {Component} from 'react';
import axios from 'axios';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import OpinionCard from './OpinionCard.js';
import OpinionTable from './OpinionTable.js';

class Opinions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            topicsUnanswered: [],
            topicsAnswered: []
        }

        this.getUnansweredTopics = this.getUnansweredTopics.bind(this);
        this.onClickOpinion = this.onClickOpinion.bind(this);
        this.errorHandler = this.errorHandler.bind(this);

        this.signal = axios.CancelToken.source();
    }

    static defaultProps = {
        headers: {},
        onSessionExpired: function () {
            return null;
        }
    }

    onClickOpinion(answer) {
        let topicsUnanswered = this.state.topicsUnanswered.slice(1, this.state.topicsUnanswered.length);
        if (!answer) {
            this.setState({topicsUnanswered});
            return;
        }

        let topic = this.state.topicsUnanswered[0];
        let topicID = topic.topicID;
        let choiceID = topic.choices.find(choice => choice.choiceValue === answer).choiceID;

        axios.post(process.env.REACT_APP_API_URL + '/user/topics/unanswered/set', {
            topicID,
            choiceID,
            cancelToken: this.signal.token
        }, {headers: this.props.headers})
            .then((response) => {

                if (topicsUnanswered.length === 0) this.getUnansweredTopics();

                // todo: limit topicsAnswered to 30 items
                this.setState({
                    topicsUnanswered,
                    topicsAnswered: [{question: topic.question, answer}, ...this.state.topicsAnswered]
                });
            })
            .catch(this.errorHandler);
    }

    getUnansweredTopics() {
        axios.get(process.env.REACT_APP_API_URL + '/user/topics/unanswered', {
            headers: this.props.headers,
            cancelToken: this.signal.token
        })
            .then((response) => {
                this.setState({topicsUnanswered: response.data.topics});
            }).catch(this.errorHandler);
    }

    componentDidMount() {
        // get unanswered topics
        this.getUnansweredTopics();

        // get answered topics - this is limited to 30 items from server
        axios.get(process.env.REACT_APP_API_URL + '/user/topics/answered', {
            headers: this.props.headers,
            cancelToken: this.signal.token
        })
            .then((response) => {

                let topicsAnswered = response.data.topics.map(topic => {
                    return {question: topic.question, answer: topic.answer}
                });

                this.setState({topicsAnswered});
            }).catch(this.errorHandler);
    }

    componentWillUnmount() {
        this.signal.cancel();
    }

    errorHandler(error) {
        if (error.response && error.response.data.title === 'InvalidUser') this.props.onSessionExpired();
    }

    render() {
        let currentTopic = this.state.topicsUnanswered.length > 0 ? this.state.topicsUnanswered[0] : null;
            return (
                <Grid container>
                    <Grid item xs={12} mb={3}>
                        <Box mb={3}>
                            <Typography variant="h2">
                                The question is...
                            </Typography>
                        </Box>
                        <Box mb={3}>
                            { currentTopic ? (
                                    <OpinionCard
                                        width={800}
                                        question={currentTopic.question}
                                        choiceA={currentTopic.choices[0].choiceValue}
                                        choiceB={currentTopic.choices[1].choiceValue}
                                        onClick={this.onClickOpinion}
                                        limitedTime={currentTopic.isLimitedTime}
                                    />
                                ) : (
                                    <Alert severity="warning">We're out of topics. Please chat instead if you want.</Alert>
                                )
                            }
                        </Box>
                    </Grid>
                    { this.state.topicsAnswered.length > 0 ? (
                        <Grid item xs={12}>
                            <Box mb={3} >
                                <Typography variant="h2">
                                    You answered...
                                </Typography>
                            </Box>
                            <Box>
                                <OpinionTable width={800} entries={this.state.topicsAnswered}/>
                            </Box>
                        </Grid>
                        ) : <span></span>
                    }
                </Grid>
        )
    }
}

export default Opinions;