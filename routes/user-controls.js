// route for all logged-in user
const router = require("express").Router();
const decodeTokenMiddleware = require('./decode-token.js');

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
    let [user, error] = await resolve( User.find({ userID: request.decoded.userID }) );
    if (error) return response.status(400).send({ title: 'Invalid User', message: 'This user does not exist' });
    response.json({ title: 'Success', message: 'This user is valid!' });
});

/**
 * This route gets the topics a valid user has given an answer to.
 * This means it responds back with an Array called 'topics' through JSON.
 */
 router.get('/topics/answered', [decodeTokenMiddleware, handleBadDecodedRequest], async function(request, response) {
    let [user, userError] = await resolve( User.findOne({ userID: request.decoded.userID }) );
    if (userError) return response.status(400).send({ title: 'Invalid User', message: 'This user does not exist' });

    // sort createdAt -1 returns the latest documents since it orders them by descending order,
    // and the highest value is the latest on
    let query = {topicID: { $in: user.topics.map(topic => topic.topicID) } }; // $nin means not in
    let [topics, topicError] = await resolve( Topic.find(query).sort({ createdAt: -1}).limit(DOCUMENTS_PER_PAGE) );

    if (topicError) return response.status(400).send({ title: 'Error', message: 'Topic retrieval failed.' });
    response.json({ topics });
});

/**
 * This route gets the topics a valid user hasn't given an answer to yet.
 * This means it responds back with an Array called 'topics' through JSON.
 */
router.get('/topics/unanswered', [decodeTokenMiddleware, handleBadDecodedRequest], async function(request, response) {
    let [user, userError] = await resolve( User.findOne({ userID: request.decoded.userID }) );
    if (userError) return response.status(400).send({ title: 'Invalid User', message: 'This user does not exist' });

    // sort createdAt -1 returns the latest documents since it orders them by descending order,
    // and the highest value is the latest on
    let query = {topicID: { $nin: user.topics.map(topic => topic.topicID) } }; // $nin means not in
    let [topics, topicError] = await resolve( Topic.find(query).sort({ createdAt: -1}).limit(DOCUMENTS_PER_PAGE) );

    if (topicError) return response.status(400).send({ title: 'Error', message: 'Topic retrieval failed.' });
    response.json({ topics });
});


/**
 * Use to elegantly handle promises.
 * @param {*} promise 
 * @returns 
 */
async function resolve(promise) {
    try {
        const data = await promise;
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