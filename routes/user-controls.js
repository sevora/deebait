// route for all logged-in user
const router = require("express").Router();
const { decodeTokenMiddleware } = require('./decode-token.js');

const DOCUMENTS_PER_PAGE = 30;

const User = require("../models/user.js");
const Topic = require("../models/topic.js");
const Thread = require('../models/thread.js');

/**
 * This route is used to check for a user's validity.
 * It just returns a success message if the user exists (aka valid)
 * and an error message if not.
 */
router.get('/check', [decodeTokenMiddleware, handleBadDecodedRequest], async function(request, response) {
    let [user, error] = await resolve( User.findOne({ userID: request.decoded.userID }) );
    if (error) return response.status(400).send({ title: 'InvalidUser', message: 'This user does not exist' });
    response.json({ title: 'Success', message: 'This user is valid!' });
});

/**
 * This route gets the topics a valid user has given an answer to.
 * This means it responds back with an Array called 'topics' through JSON.
 */
 router.get('/topics/answered', [decodeTokenMiddleware, handleBadDecodedRequest], async function(request, response) {
    let [user, userError] = await resolve( User.findOne({ userID: request.decoded.userID }) );
    if (userError) return response.status(400).send({ title: 'InvalidUser', message: 'This user does not exist' });

    // we just wanna unpack every topicID and choiceID from the user's topics
    let userTopicIDs = [];
    let userChoiceIDs = [];

    user.topics.forEach(topic => {
        userTopicIDs.push(topic.topicID),
        userChoiceIDs.push(topic.choiceID)
    });

    // sort createdAt -1 returns the latest documents since it orders them by descending order,
    // and the highest value is the latest on
    let query = { topicID: { $in: userTopicIDs } }; 
    let [topics, topicError] = await resolve( 
        Topic
            .find(query)
            .select(['-_id', '-createdAt', '-updatedAt'])
            .sort({ createdAt: 1})
            .limit(DOCUMENTS_PER_PAGE) 
        );

    if (topicError) return response.status(400).send({ title: 'TopicsNotFound', message: 'Topic retrieval failed.' });

    let topicsWithAnswer = [];
    
    topics.forEach(topic => {
        let indexOfTopic = userTopicIDs.indexOf(topic.topicID);
        let currentChoiceID = userChoiceIDs[indexOfTopic];
        let answer = topic.choices.find(choice => choice.choiceID == currentChoiceID).choiceValue;
        topicsWithAnswer.push({ question: topic.question, answer });
    });

    response.json({ topics: topicsWithAnswer });
});

/**
 * This route gets the topics a valid user hasn't given an answer to yet.
 * This means it responds back with an Array called 'topics' through JSON.
 */
router.get('/topics/unanswered', [decodeTokenMiddleware, handleBadDecodedRequest], async function(request, response) {
    let [user, userError] = await resolve( User.findOne({ userID: request.decoded.userID }) );
    if (userError) return response.status(400).send({ title: 'InvalidUser', message: 'This user does not exist' });

    // sort createdAt -1 returns the latest documents since it orders them by descending order,
    // and the highest value is the latest on
    let query = {topicID: { $nin: user.topics.map(topic => topic.topicID) } }; // $nin means not in
    let [topics, topicError] = await resolve( 
            Topic
                .find(query)
                .select(['-_id', 'topicID', 'question', 'choices'])
                .sort({ createdAt: -1})
                .limit(DOCUMENTS_PER_PAGE) 
        );

    if (topicError) return response.status(400).send({ title: 'TopicsNotFound', message: 'Topic retrieval failed.' });
    response.json({ topics });
});

/**
 * This route is used to set a user's answer on a topic.
 * Ofcourse it handles errors too.
 */
router.post('/topics/unanswered/set', [decodeTokenMiddleware, handleBadDecodedRequest], async function(request, response) {
    let [user, userError] = await resolve( User.findOne({ userID: request.decoded.userID }) );
    if (userError) return response.status(400).send({ title: 'InvalidUser', message: 'This user does not exist' });

    let topicID, choiceID;

    try {
        ({ topicID, choiceID } = request.body);
    } catch (error) {
        return response.status(400).send({ title: 'InvalidOperation', message: 'Dude, wtf. Stop.' });
    }
    
    let [topic, topicError] = await resolve( Topic.findOne({ topicID }) );
    if (topicError) return response.status(400).send({ title: 'TopicNotFound', message: 'This topic does not exist.' });

    let choiceFound = topic.choices.find(choice => choice.choiceID == choiceID);
    if (!choiceFound) return response.status(400).send({ title: 'ChoiceNotFound', message: 'This choice does not exist.' });

    user.topics.push({ topicID, choiceID });
    await user.save();

    response.json({ title: 'OpinionAdded', message: 'Successfully added opinion!' });
});

/**
 * Use to elegantly handle promises.
 * @param {*} promise 
 * @returns 
 */
async function resolve(promise) {
    try {
        const data = await promise;
        if (data == null) {
            return [null, new Error('NoSuchDocument')];
        }
        return [data, null];
    } catch (error) {
        return [null, error];
    }
}

// Sample code for pagination
// sexyModel.find()
//     .skip(pageOptions.page * pageOptions.limit)
//     .limit(pageOptions.limit)
//     .exec(function (err, doc) {
//         if(err) { res.status(500).json(err); return; };
//         res.status(200).json(doc);
//     });

/**
 * Custom middleware to handle bad decode request 
 * when using the JWT.
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleBadDecodedRequest(request, response, next) {
    if (request.decoded.error) {
        if (request.decoded.expired) {
            response.status(400).send({ title: 'Session Expired', message: 'Please log-in again.' });
        } else {
            response.status(400).send({ title: 'Internal Server Error', message: 'Please try again later.' });
        }
    } else {
        next();
    }
}

module.exports = router;