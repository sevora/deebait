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
        return socket.disconnect();
    }

    // I think I can remove this line lol
    if (!token) return;

    decodeToken(token, async (error, decoded) => {
        if (error) return socket.disconnect();
        let [user, userError] = await resolve( User.findOne({ userID: decoded.userID }) );
        if (userError || user.isBanned) return socket.disconnect();

        // The piece of code below either gets an existing user connection
        // or creates a new one if it doesn't exist.
        let connection = connections[user.userID];

        if (!connection) {
            connections[user.userID] = new ChatConnection(user.userID, user);
            connection = connections[user.userID]   
            await connection.findPartner();
        }

        connection.addSocket(socket);
    });
}

/**
 * This is an implementation of a ChatConnection referring to a connection
 * between two users. The server simply passes the messages around.
 */
class ChatConnection extends Connection {
    constructor(key, document) {
        super();
        
        this.key = key;
        this.document = document;
        this.thread = null;

        this.queued = false;
        this.partner = null;
        this.topics = null;
        this.answers = null;

        this.threadSaves = 0;
    }

    /**
     * This implementation disconnects and deletes the partner (if there is any),
     * plus saves the thread and then deletes itself.
     */
    onEmptySockets() {
        // Of course, if this thing doesn't have a partner yet, then it is on queue,
        // In which case it should be removed.
        if (!this.partner) {
            for (let index = matchQueue.length-1; index >= 0; --index) {
                if (matchQueue[index].key == this.key) {
                    matchQueue.splice(index, 1);
                    break;
                }
            }
        } else {
            this.partner.emit('partner-left');
            this.partner.disconnect();
            delete connections[this.partner.key];

            Thread.findOne({ threadID: this.thread.threadID }, function(error, thread) {
                if (error) return;
                if (thread.messages.length === 0) thread.remove();
            });

        } 

        delete connections[this.key];
    }

    /**
     * This defines how partners communicate between each other.
     * @param socket A socket provided by whatever called this method.
     */
    onRegisterSocket(socket) {
        socket.on('send-to-partner', data => {
            let message = data ? data.message : null;

            if (this.partner && message) {
                // We limit messages to 250 characters all the time.
                message = message.trim().substring(0, 250);
                socket.emit('was-sent-to-partner', { message });
                this.partner.emit('has-message', { message });
                
                // This limits the thread saving to 10,000 saves.
                if (this.threadSaves < 10000 && this.thread) {

                    // This query updates the thread directly to the database.
                    Thread.updateOne(
                        { _id: this.thread._id }, 
                        { $push: { messages: { messageValue: message, senderID: this.document.userID } } },
                        function (error, success) {
                            return;
                        }
                    );

                    this.partner.threadSaves = ++this.threadSaves;
                }
            }
        });

        // This listener is part of the typing feature.
        // When someone is typing, they should see, 
        // something similar to "X is typing"
        socket.on('is-typing', () => {
            if (this.partner) {
                this.partner.emit('is-partner-typing');
            }
        });

        // This listener is part of the typing feature.
        // It should send a message to stop the typing.
        socket.on('not-typing', () => {
            if (this.partner) {
                this.partner.emit('is-partner-not-typing');
            }
        });

        // If the user has a partner, this makes it so that
        // the client socket knows it has a partner.
        if (this.partner) { 
            socket.emit('has-partner', { differences: this.getConflictingAnswers() });
            this.partner.emit('has-partner', { differences: this.partner.getConflictingAnswers() });
        }
    }

    /**
     * This causes only a side effect related to values of the 
     * connections in matchQueue including 'this' 
     * The algorithm works as follows:
     * 1. If queue is empty simply add 'this' to queue, if so END. 
     * 2. Iterate through the queue array and if a connection matches the criteria,
     * 3. Set each other as each other's partners and then END
     * 4. If there are no matches, add 'this' to queue, then END.
     */
    async findPartner() {
        if (matchQueue.length == 0) {
            matchQueue.push(this);
            this.queued = true;
        }

        if (this.queued) return;

        let mapTopicID = topic => topic.topicID;
        let mapChoiceID = topic => topic.choiceID;

        let topics = this.document.topics;
        let topicsIDs = topics.map(mapTopicID);
        let choiceIDs = topics.map(mapChoiceID);

        for (let index = matchQueue.length - 1; index >= 0; --index) {
            let otherTopics = matchQueue[index].document.topics;

            let otherTopicsIDs = otherTopics.map(mapTopicID);
            let sameTopicsIDs = commonElements(topicsIDs, otherTopicsIDs);
            if (sameTopicsIDs.length == 0) continue;
            
            let [sameTopics, sameTopicsError] = await resolve(Topic.find({ topicID: { $in: sameTopicsIDs }}).sort({ createdAt: -1}).limit(10) );
            if (sameTopicsError) continue;   
            let otherChoiceIDs = otherTopics.map(mapChoiceID);

            // these parts could've been written better
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

                // set their thread
                let newThread = new Thread({ participantIDs: [ this.document.userID, this.partner.document.userID ] });
                let [thread, threadError] = await resolve( newThread.save() );
                if (threadError) return;

                this.thread = thread;
                this.partner.thread = this.thread;
                this.partner.queued = false; // not necessary but let's add it to prevent possible future problems

                matchQueue.splice(index, 1);
                return;
            }
        }

        matchQueue.push(this);
        this.queued = true;        
    }

    /**
     * This simply calculates an array of conflicting answers between the partners.
     * @returns An array of objects with question and answer keys that has String values.
     */
    getConflictingAnswers() {
        let conflicting = [];
        if (this.answers) this.answers.forEach((answer, index) => {
            if (this.partner.answers[index] != answer) {
                conflicting.push({ question: this.topics[index].question, answer, partnerAnswer: this.partner.answers[index] });
            }
        });
        return conflicting;
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