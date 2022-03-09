// route for all logged-in user
const router = require("express").Router();
const { resolve } = require('../helper.js');
const { decodeTokenMiddleware } = require('./decode-token.js');

const DOCUMENTS_PER_PAGE = 30; // Documents -> A database entry

const User = require("../models/user.js");
const Topic = require("../models/topic.js");
const Thread = require('../models/thread.js');

/**
 * GET /user/check
 * This route is used to check for a user's validity.
 * It just returns a success message if the user exists (aka valid)
 * and an error message if not.
 */
router.get('/check', [decodeTokenMiddleware, handleBadDecodedRequest], async function(request, response) {
    let [user, error] = await resolve( User.findOne({ userID: request.decoded.userID }) );
    if (error || user.isBanned) return response.status(400).send({ title: 'InvalidUser', message: 'This user does not exist' });
    response.json({ title: 'Success', message: 'This user is valid!' });
});

/**
 * GET /user/topics/answered
 * This route gets the topics a valid user has given an answer to.
 * This means it responds back with an Array called 'topics' through JSON.
 */
 router.get('/topics/answered', [decodeTokenMiddleware, handleBadDecodedRequest], async function(request, response) {
    let [user, userError] = await resolve( User.findOne({ userID: request.decoded.userID }) );
    if (userError || user.isBanned) return response.status(400).send({ title: 'InvalidUser', message: 'This user does not exist' });

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
            .sort({ createdAt: -1})
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
 * GET /user/topics/unanswered
 * This route gets the topics a valid user hasn't given an answer to yet.
 * This means it responds back with an Array called 'topics' through JSON.
 */
router.get('/topics/unanswered', [decodeTokenMiddleware, handleBadDecodedRequest], async function(request, response) {
    let [user, userError] = await resolve( User.findOne({ userID: request.decoded.userID }) );
    if (userError || user.isBanned) return response.status(400).send({ title: 'InvalidUser', message: 'This user does not exist' });

    // sort createdAt -1 returns the latest documents since it orders them by descending order,
    // and the highest value is the latest on
    let query = {topicID: { $nin: user.topics.map(topic => topic.topicID) } }; // $nin means not in
    let [topics, topicError] = await resolve( 
            Topic
                .find(query)
                .select(['-_id', 'topicID', 'question', 'choices', 'isLimitedTime' ])
                .sort({ createdAt: -1})
                .limit(DOCUMENTS_PER_PAGE) 
        );

    if (topicError) return response.status(400).send({ title: 'TopicsNotFound', message: 'Topic retrieval failed.' });
    response.json({ topics });
});

/**
 * POST /user/topics/unanswered/set
 * This route is used to set a user's answer on a topic.
 * It checks the body of the request for topicID and choiceID
 * and uses that to set the user's choice in a topic.
 */
router.post('/topics/unanswered/set', [decodeTokenMiddleware, handleBadDecodedRequest], async function(request, response) {
    let [user, userError] = await resolve( User.findOne({ userID: request.decoded.userID }) );
    if (userError || user.isBanned) return response.status(400).send({ title: 'InvalidUser', message: 'This user does not exist' });

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
 * GET /user/threads/past
 * This responds with the threads that the user has been involved with.
 */
router.get('/threads/past', [decodeTokenMiddleware, handleBadDecodedRequest], async function(request, response) { 
    let [user, userError] = await resolve( User.findOne({ userID: request.decoded.userID }) );
    if (userError || user.isBanned) return response.status(400).send({ title: 'InvalidUser', message: 'This user does not exist' });
    
    let [threads, threadsError] = await resolve(
        Thread
            .find({ participantIDs: user.userID })
            .select(['-messages'])
            .sort({ createdAt: -1})
            .limit(DOCUMENTS_PER_PAGE)
    );

    if (threadsError && threads != null) return response.status(400).send({ title: 'ThreadError', message: 'Error retrieving threads.' });
    if (threads == null) return response.json({ threads: [] });
    response.json({ threads });
});

/**
 * POST /threads/view
 * This responds with the thread entry of the corresponding threadID 
 * in the request's body. This does not check if the user is a participant of 
 * the thread so anyone can get anybody else's thread but they wouldn't know who is
 * who since the sender property will all be false.
 */
router.post('/threads/view', [decodeTokenMiddleware, handleBadDecodedRequest], async function(request, response) {
    let [user, userError] = await resolve( User.findOne({ userID: request.decoded.userID }) );
    if (userError || user.isBanned) return response.status(400).send({ title: 'InvalidUser', message: 'This user does not exist' });

    let threadID;

    try {
        ({ threadID } = request.body);
    } catch (error) {
        return response.status(400).send({ title: 'InvalidOperation', message: 'Dude, wtf. Stop.' });
    }

    let [thread, threadError] = await resolve( Thread.findOne({ threadID }) );
    if (threadError) return response.status(400).send({ title: 'ThreadNotFound', message: 'This thread does not exist.' });

    let formattedThread = { messages: [], createdAt: thread.createdAt };
    
    thread.messages.map(message => {
        formattedThread.messages.push({ messageValue: message.messageValue, sender: message.senderID == user.userID ? 'user': 'partner' });
    })

    response.json({ thread: formattedThread });
});

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
 * @param request 
 * @param response 
 * @param next 
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