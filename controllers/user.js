const User = require("../models/user.js");
const Topic = require("../models/topic.js");
const Thread = require('../models/thread.js');

const DOCUMENTS_PER_PAGE = 30; // Documents -> A database entry



exports.checkUser = async (request, response, next) => {
    try {
        const user = await User.findOne({ userID: request.decoded.userID });
        if (!user || user.isBanned) {
            const error = new Error('User not found');
            error.statusCode = 400;
            error.message = 'This user does not exist';
            throw error;
        }
        response.json({ title: 'Success', message: 'This user is valid!' });
    } catch (e) {
        e.statusCode = e.statusCode || 500;
        next(e)
    }
}

exports.getAnsweredTopics = async (request, response, next) => {
    try {
        const { userID } = request.decoded;
        const user = await User.findOne({ userID }).select('topics isBanned');

        if (!user || user.isBanned) {
            throw { statusCode: 400, title: 'UserNotFound', message: 'This user does not exist' };
        }

        const userTopicIDs = user.topics.map(topic => topic.topicID);
        const userChoiceIDs = user.topics.map(topic => topic.choiceID);

        const query = { topicID: { $in: userTopicIDs } };
        const topics = await Topic.find(query).select('-_id -createdAt -updatedAt').sort({ createdAt: -1 }).limit(DOCUMENTS_PER_PAGE);

        const topicsWithAnswer = topics.map(topic => {
            const indexOfTopic = userTopicIDs.indexOf(topic.topicID);
            const currentChoiceID = userChoiceIDs[indexOfTopic];
            const answer = topic.choices.find(choice => choice.choiceID === currentChoiceID).choiceValue;

            return { question: topic.question, answer };
        });

        response.status(200).json({ topics: topicsWithAnswer });
    } catch (e) {
        e.statusCode = e.statusCode || 500;
        next(e)
    }
};

exports.getUnansweredTopics = async (request, response, next) => {
    try {
        const user = await User.findOne({ userID: request.decoded.userID });
        if (!user || user.isBanned) {
            throw new Error('Invalid user');
        }

        const query = { topicID: { $nin: user.topics.map((topic) => topic.topicID) } };
        const topics = await Topic.find(query)
            .select('-_id topicID question choices isLimitedTime')
            .sort({ isLimitedTime: -1, createdAt: -1 })
            .limit(DOCUMENTS_PER_PAGE)
            ;

        response.status(200).json({ topics: topics });
    } catch (error) {
        e.statusCode = e.statusCode || 500;
        next(e)
    }
};


exports.setAnswer = async (request, response, next) => {
    try {
        const { topicID, choiceID } = request.body;
        const user = await User.findOne({ userID: request.decoded.userID });
        if (!user || user.isBanned) return response.status(400).send({ title: 'InvalidUser', message: 'This user does not exist' });
        if (!topicID || !choiceID) return response.status(400).send({ title: 'InvalidOperation', message: 'Dude, wtf. Stop.' });

        const topic = await Topic.findOne({ topicID })
        if (!topic) {
            const error = new Error('Topic not found');
            error.statusCode = 400;
            error.message = 'This topic does not exist';
        }

        const choiceFound = topic.choices.find(choice => choice.choiceID == choiceID);
        if (!choiceFound) {
            const error = new Error('Choice not found');
            error.statusCode = 400;
            error.message = 'This choice does not exist';
            throw error;
        }

        user.topics.push({ topicID, choiceID });
        await user.save();

        response.status(200).json({ title: 'OpinionAdded', message: 'Successfully added opinion!' });
    } catch (e) {
        e.statusCode = e.statusCode || 500;
        next(e)
    }
}


exports.getThreads = async (request, response, next) => {
    try {
        const user = await User.findOne({ userID: request.decoded.userID });
        if (!user || user.isBanned) {
            const error = new Error('User not found');
            error.statusCode = 400;
            error.message = 'This user does not exist';
            throw error;
        }

        const threads = await
            Thread
                .find({ participantIDs: user.userID })
                .select(['-messages'])
                .sort({ createdAt: -1 })
                .limit(DOCUMENTS_PER_PAGE)
                ;
        if (!threads) {
            const error = new Error('Threads not found');
            error.statusCode = 400;
            throw error;
        }

        response.status(200).json({ threads });
    } catch (e) {
        e.statusCode = e.statusCode || 500;
        next(e)
    }
}


exports.getThreadById = async (request, response, next) => {
    try {
        const user = await User.findOne({ userID: request.decoded.userID });
        const { threadID } = request.body;
        if (!user || user.isBanned) {
            const error = new Error('User not found');
            error.statusCode = 400;
            error.message = 'This user does not exist';
            throw error;
        }
        if(!threadID) {
            const error = new Error('Invalid operation');
            error.statusCode = 400;
            error.message = 'Dude, wtf. Stop.';
            throw error;
        }

        const thread = await Thread.findOne({ threadID, participantIDs: { $in: user.userID } });
        if (!thread) {
            const error = new Error('Thread not found');
            error.statusCode = 400;
            error.message = 'This thread does not exist';
            throw error;
        }

        const messages = thread.messages.map(message => ({
            messageValue: message.messageValue,
            sender: message.senderID == user.userID ? 'user' : 'partner'
        }));

        const formattedThread = { messages, createdAt: thread.createdAt };

        response.json({ thread: formattedThread });
    } catch (e) {
        e.statusCode = e.statusCode || 500;
        next(e)
    }
}