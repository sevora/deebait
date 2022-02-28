// rewrote everything to handle multiple sockets for a single user
const User = require('../models/user.js');
const Topic = require('../models/topic.js');
const Thread = require('../models/thread.js');

const Connection = require('./connection.js');
const { resolve } = require('../helper.js');
const { decodeToken } = require('../routes/decode-token');

let connections = {};
let matchQueue = [];

/**
 * Comment this code below if unnecessary anymore, just parses crap
 */
setInterval(function() {
    console.log(`No. of users connected: ${Object.keys(connections).length}`);
    console.log(`No. of connections: ${Object.values(connections).map(connection => connection.sockets.length).join(', ')}`);
}, 500); 

/**
 * This is used as a callback inside io.on('connection') and it should receive the
 * incoming socket and io. Here's how this works:
 * 1. User finds match or gets into queue
 * 2. Connection (both partners) gets alerted to the right state
 * 3. If connection ends by one, alert the other that they're no longer connected
 * 4. Save the whole message
 * @param socket 
 * @param io 
 * @returns 
 */
function onConnectIO(socket, io) {
    let token;

    try {
        token = parseHeaderToToken(socket.handshake.headers['deebaitheader']);
    } catch(error) {
        console.log(error)
        socket.disconnect();
    }

    if (!token) return;

    decodeToken(token, async (error, decoded) => {
        if (error) return socket.disconnect();
        let [user, userError] = await resolve( User.findOne({ userID: decoded.userID }) );
        if (userError || user.isBanned) return socket.disconnect();

        // create connection to user
        let connection = connections[user.userID];

        if (!connection) {
            connections[user.userID] = new ChatConnection(user.userID, user, [socket]);
            connection = connections[user.userID]   
            await connection.findPartner();
            if (connection.partner) console.log(`[${connection.key}] HAS PARTNER [1]`);
        }

        if (connection.partner) console.log(`[${connection.key}] HAS PARTNER [2]`);
        connection.addSocket(socket);
        if (connection.partner) console.log(`[${connection.key}] HAS PARTNER [4]`);
    });
}

class ChatConnection extends Connection {
    constructor(key, document, sockets) {
        super(sockets);
        
        this.key = key;
        this.document = document;

        this.queued = false;
        this.partner = null;
        this.topics = null;
        this.answers = null;
    }

    onEmptySockets() {
        if (!this.partner) {
            for (let index = matchQueue.length-1; index >= 0; --index) {
                if (matchQueue[index].key == this.key) {
                    matchQueue.splice(index, 1);
                    break;
                }
            }
        } else {
            this.partner.emit('partner-left');
            delete connections[this.partner.key];
            console.log(`${this.key} has left partner ${this.partner.key}`);
        } 

        delete connections[this.key];
    }

    onRegisterSocket(socket) {
        if (this.partner) console.log(`[${this.key}] HAS PARTNER [3]`);

        if (this.partner) { 
            socket.emit('has-partner');
            this.partner.emit('has-partner');
        }
    }

    async findPartner() {
        if (matchQueue.length == 0) {
            matchQueue.push(this);
            return null;
        }

        if (this.queued) return null;

        let mapTopicID = topic => topic.topicID;
        let mapChoiceID = topic => topic.choiceID;

        let topics = this.document.topics;
        let topicsIDs = topics.map(mapTopicID);
        let choiceIDs = topics.map(mapChoiceID);

        for (let index = matchQueue.length - 1; index >= 0; --index) {
            let otherTopics = matchQueue[index].document.topics;

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
                return null;
            }
        }

        matchQueue.push(this);
        this.queued = true;        
    }
}

/**
 * Parses token from header
 * @param {String} string 
 * @returns String with headers
 */
 function parseHeaderToToken(string) {
    let object = JSON.parse(string);
    return object['Authorization'].split(' ')[1];
}

/**
 * Literally finds the common elements of two arrays
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