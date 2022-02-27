// register socket as a user
// 
const User = require('../models/user.js');
const Topic = require('../models/topic.js');
const Thread = require('../models/thread.js');

const { resolve } = require('./helper.js');
const { decodeToken } = require('./decode-token');

let matchQueue = [];
let userIDToUserSocket = {};

setInterval(function() {
    console.log(Object.values(userIDToUserSocket).length);
}, 1000);

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

        let { userID } = user;

        if (!userIDToUserSocket[userID]) {
            let userSocket = new UserSocket(user, socket);
            userIDToUserSocket[userID] = userSocket;
            userSocket.findPartnerInQueue();
            userSocket.registerSocketEvents();
        }
    });
}

class UserSocket {
    constructor(document, socket) {
        this.document = document;
        this.socket = socket;

        this.partner = null;
        this.topics = null;
        this.answers = null;
    }

    getDocument() {
        return this.document;
    }

    async findPartnerInQueue() {
        if (matchQueue.length == 0) {
            matchQueue.push(this);
            return null;
        }

        let mapTopicID = topic => topic.topicID;
        let mapChoiceID = topic => topic.choiceID;

        let topics = this.getDocument().topics;
        let topicsIDs = topics.map(mapTopicID);
        let choiceIDs = topics.map(mapChoiceID);

        for (let index = matchQueue.length - 1; index >= 0; --index) {
            let otherTopics = matchQueue[index].getDocument().topics;

            let otherTopicsIDs = otherTopics.map(mapTopicID);
            let sameTopicsIDs = commonElements(topicsIDs, otherTopicsIDs);
            
            let [sameTopics, sameTopicsError] = await resolve(Topic.find({ topicID: { $in: sameTopicsIDs }}) );
            if (sameTopicsError) continue;   
            let otherChoiceIDs = otherTopics.map(mapChoiceID);

            let answers = sameTopics.map(topic => {
                let index = topicsIDs.indexOf(topic.topicID);
                let choiceID = choiceIDs[index];
                return topic.choices.find(choice => choice.choiceID == choiceID).choiceValue;
            });

            let otherAnswers = sameTopics.map(topic => {
                let index = otherTopicsIDs.indexOf(topic.topicID);
                let choiceID = otherChoiceIDs[index];
                return topic.choices.find(choice => choice.choiceID == choiceID).choiceValue;
            });
            
            let disagreeCount = sameTopics.length - commonElements(answers, otherAnswers).length;

            if (disagreeCount > 0) {
                // set the partners correctly
                this.partner = matchQueue[index];
                this.partner.partner = this;

                // set the topics correctly
                this.topics = sameTopics;
                this.partner.topics = sameTopics;
                
                // set the answers correctly
                this.answers = answers;
                this.partner.answers = otherAnswers;

                matchQueue.splice(index, 1);
                return this.partner;
            }
        }
        
        matchQueue.push(this);
        return null;
    }

    getPartnerAnswers() {
        if (!this.partner) return null;
        return this.partner.answers;
    }

    getConflictingAnswers() {
        let conflicting = [];
        if (this.answers) this.answers.forEach((answer, index) => {
            if (this.partner.answers[index] != answer) {
                conflicting.push({ question: this.topics[index].question, answer: this.partner.answers[index] });
            }
        });
        return conflicting;
    }

    unsetPartner() {
        if (this.partner) this.partner.unsetPartner();
        this.partner = null;
        this.topic = null;
        this.answers = null;
    }

    registerSocketEvents() {
        // send to assigned partner
        // update db
        this.socket.on('message', async function(data) {
            
            
        });

        this.socket.on('disconnect', (reason) => {
            // unpair and remove both
            let userID = this.getDocument().userID;
            delete userIDToUserSocket[userID];
            matchQueue = matchQueue.filter(userSocket => userSocket.getDocument().userID != userID);
            this.unsetPartner();

            console.log('disconnect', reason);
        });

        // if there is a partner 
        // emit to both an event that says they have a partner
    }
}

// input of type String: {"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJmNTRhY2M1OC1mZmJjLTQxY2ItOTAwMy1iNmQ5NDZiNDA2NGUiLCJpYXQiOjE2NDU5NTE5MzEsImV4cCI6MTY0NjAzODMzMX0.PymRdyH2HKelultvwa-s3acgtr-xpBVS9tsJS8f5GAU"}
// output of type String: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJmNTRhY2M1OC1mZmJjLTQxY2ItOTAwMy1iNmQ5NDZiNDA2NGUiLCJpYXQiOjE2NDU5NTE5MzEsImV4cCI6MTY0NjAzODMzMX0.PymRdyH2HKelultvwa-s3acgtr-xpBVS9tsJS8f5GAU
function parseHeaderToToken(string) {
    let object = JSON.parse(string);
    return object['Authorization'].split(' ')[1];
}

/**
 * Literally finds the common elements of two arras
 * @param {*} array1 
 * @param {*} array2 
 * @returns 
 */
function commonElements(array1, array2) {
    let result = [];

    array1.forEach(x => {
        array2.forEach(y => {
            if (x == y) result.push(x);
        });
    });

    return result;
}

module.exports = onConnectIO;