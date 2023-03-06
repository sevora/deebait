// route for all logged-in user
const router = require("express").Router();
const { resolve } = require('../helper.js');

const DOCUMENTS_PER_PAGE = 30; // Documents -> A database entry

const User = require("../models/user.js");
const Topic = require("../models/topic.js");
const Thread = require('../models/thread.js');
const { isAuth, handleBadDecodedRequest } = require("../middlewares/isAuth.js");
const { checkUser, getAnsweredTopics, getUnansweredTopics, setAnswer,getThreads, getThreadById } = require("../controllers/user.js");

/**
 * GET /user/check
 * This route is used to check for a user's validity.
 * It just returns a success message if the user exists (aka valid)
 * and an error message if not.
 */
router.get('/check', [isAuth, handleBadDecodedRequest], checkUser);

/**
 * GET /user/topics/answered
 * This route gets the topics a valid user has given an answer to.
 * This means it responds back with an Array called 'topics' through JSON.
 */
 router.get('/topics/answered', [isAuth, handleBadDecodedRequest], getAnsweredTopics);

/**
 * GET /user/topics/unanswered
 * This route gets the topics a valid user hasn't given an answer to yet.
 * This means it responds back with an Array called 'topics' through JSON.
 */
router.get('/topics/unanswered', [isAuth, handleBadDecodedRequest], getUnansweredTopics);

/**
 * POST /user/topics/unanswered/set
 * This route is used to set a user's answer on a topic.
 * It checks the body of the request for topicID and choiceID
 * and uses that to set the user's choice in a topic.
 */
router.post('/topics/unanswered/set', [isAuth, handleBadDecodedRequest],setAnswer);

/**
 * GET /user/threads/past
 * This responds with the threads that the user has been involved with.
 */
router.get('/threads/past', [isAuth, handleBadDecodedRequest],getThreads);

/**
 * POST /threads/view
 * This responds with the thread entry of the corresponding threadID 
 * in the request's body. This does not check if the user is a participant of 
 * the thread so anyone can get anybody else's thread but they wouldn't know who is
 * who since the sender property will all be false.
 */
router.post('/threads/view', [isAuth, handleBadDecodedRequest], getThreadById);

// Sample code for pagination
// sexyModel.find()
//     .skip(pageOptions.page * pageOptions.limit)
//     .limit(pageOptions.limit)
//     .exec(function (err, doc) {
//         if(err) { res.status(500).json(err); return; };
//         res.status(200).json(doc);
//     });



module.exports = router;