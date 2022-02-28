// rewrote everything to handle multiple sockets for a single user
const User = require('../models/user.js');
const Topic = require('../models/topic.js');
const Thread = require('../models/thread.js');

const Connection = require('./connection.js');
const { resolve } = require('../helper.js');
const { decodeToken } = require('../routes/decode-token');

let connections = {};

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
        }
        
        // need to update document to latest user still
        connection.document = user;

        connection.addSocket(socket);
        connection.registerEventHandlers(socket, io);
    });
}

class ChatConnection extends Connection {
    constructor(key, document, sockets) {
        super(sockets);
        
        this.key = key;
        this.document = document;
    }

    deleteInstance() {
        delete connections[this.key];
    }

    registerEventHandlers(socket, io) {
        // define me
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

module.exports = onConnectIO;