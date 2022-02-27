// register socket as a user
// 
const User = require('../models/user.js');
const Topic = require('../models/topic.js');
const Thread = require('../models/thread.js');

const { resolve } = require('./helper.js');
const { decodeToken } = require('./decode-token');

let toMatchQueue = [];
let matchedQueue = [];
let socketIDToUser = {};

function onConnectIO(socket, io) {
    let token;

    try {
        token = parseHeaderToToken(socket.handshake.headers['deebaitheader']);
    } catch(error) {
        socket.disconnect();
    }

    if (!token) return;

    decodeToken(token, async function(error, decoded) {
        if (error) return socket.disconnect();
        let [user, userError] = await resolve( User.findOne({ userID: decoded.userID }) );
        if (userError) return socket.disconnect();
        await matchToAnother(user);
        socketIDToUser[socket.id] = user;
        registerSocketEvents(socket);
    });
}

async function matchToAnother(user) {
    if (toMatchQueue.length <= 0 ) {
        toMatchQueue.push(user);
        return;
    }

    let userTopicIDs = user.topics.map(topic => topic.topicID);

    for (let index = toMatchQueue.length-1; index >= 0; --index) {
        let otherUser = toMatchQueue[index];

        let otherUserTopicIDs = otherUser.topics.map(topic => topic.topicID);
        let sameTopicIDs = findMatches(userTopicIDs, otherUserTopicIDs);
        if (sameTopicIDs.length <= 0) continue;

        let [topics, topicError] = await resolve(Topic.find({ topicID: { $in: sameTopicIDs }}) );
        if (topicError) continue;
        
        let userChoiceIDs = user.topics.map(topic => topic.choiceID);
        let otherUserChoiceIDs = otherUser.topics.map(topic => topic.choiceID);
        let disagreeCount = topics.length - findMatches(userChoiceIDs, otherUserChoiceIDs).length;
        
        // let userQuestionAndAnswer = [];
        // let otherUserQuestionAndAnswer = [];

        // topics.forEach(topic => {
        //     let indexOfTopic = userTopicIDs.indexOf(topic.topicID);
        //     let currentChoiceID = userChoiceIDs[indexOfTopic];
        //     let answer = topic.choices.find(choice => choice.choiceID == currentChoiceID).choiceValue;
        //     userQuestionAndAnswer.push({ question: topic.question, answer });
        // });

        // topics.forEach(topic => {
        //     let indexOfTopic = otherUserTopicIDs.indexOf(topic.topicID);
        //     let currentChoiceID = otherUserChoiceIDs[indexOfTopic];
        //     let answer = topic.choices.find(choice => choice.choiceID == currentChoiceID).choiceValue;
        //     otherUserQuestionAndAnswer.push({ question: topic.question, answer });
        // });
        
        if (disagreeCount > 0) {
            matchedQueue.push([ user, toMatchQueue.splice(index, 1)[0] ]);
            break;
        }
    }
    
    if (toMatchQueue.map(x => x.userID).indexOf(user.userID) == -1) {
        toMatchQueue.push(user);
    }
}

function registerSocketEvents(socket) {
    // send to assigned partner
    // update db
    socket.on('message', async function(data) {
        
        
    });

    socket.on('disconnect', function(reason) {
        // unpair and remove both
        delete socketIDToUser[socket.id];
        console.log('disconnect', reason);
    });

    // if there is a partner 
    // emit to both an event that says they have a partner
}

// input of type String: {"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJmNTRhY2M1OC1mZmJjLTQxY2ItOTAwMy1iNmQ5NDZiNDA2NGUiLCJpYXQiOjE2NDU5NTE5MzEsImV4cCI6MTY0NjAzODMzMX0.PymRdyH2HKelultvwa-s3acgtr-xpBVS9tsJS8f5GAU"}
// output of type String: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJmNTRhY2M1OC1mZmJjLTQxY2ItOTAwMy1iNmQ5NDZiNDA2NGUiLCJpYXQiOjE2NDU5NTE5MzEsImV4cCI6MTY0NjAzODMzMX0.PymRdyH2HKelultvwa-s3acgtr-xpBVS9tsJS8f5GAU
function parseHeaderToToken(string) {
    let object = JSON.parse(string);
    return object['Authorization'].split(' ')[1];
}

function findMatches(array1, array2) {
    let result = [];

    array1.forEach(x => {
        array2.forEach(y => {
            if (x == y) result.push(x);
        });
    });

    return result;
}

function findPartnerInQueue(user) {

}

module.exports = onConnectIO;