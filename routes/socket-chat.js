// rewrote everything to handle multiple sockets for a single user
const User = require('../models/user.js');
const Topic = require('../models/topic.js');
const Thread = require('../models/thread.js');

const { resolve } = require('./helper.js');
const { decodeToken } = require('./decode-token');

let connections = {};

/**
 * Comment this code below if unnecessary anymore, just parses crap
 */
// setInterval(function() {
//     console.log(`No. of users connected: ${Object.keys(connections).length}`);
//     console.log(`No. of connections: ${Object.values(connections).map(connection => connection.sockets.length).join(', ')}`);
// }, 500);

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
            connections[user.userID] = new Connection(user.userID, user, [socket]);
            connection = connections[user.userID]
        }
        
        // need to update document to latest user still
        connection.document = user;

        connection.addSocket(socket);
        connection.registerEventHandlers(socket, io);
    });
}

class Connection {
    constructor(key, document, sockets) {
        this.key = key;
        this.document = document;
        this.sockets = [];

        sockets.forEach(socket => {
            this.addSocket(socket);
        });
    }

    addSocket(socket) {
        if (this.sockets.map(socket => socket.id).indexOf(socket.id) == -1) {
            socket.on('disconnect', (reason) => this.socketDisconnectHandler.bind(this)(reason, socket));
            this.sockets.push(socket);
        }
    }

    emit(title, data) {
        this.sockets.forEach(socket => {
            socket.emit(title, data);
        });
    }

    socketDisconnectHandler(reason, socket) {
        // console.log(`Connected ID: ${this.document.userID} Removed: ${socket.id}`);

        for (let index = this.sockets.length-1; index >= 0; --index) {
            if (this.sockets[index].id == socket.id) this.sockets.splice(index, 1);
        }

        if (this.sockets.length == 0) {
            delete connections[this.key];
        }
    }

    registerEventHandlers(socket, io) {
        // console.log(`Connected ID: ${this.document.userID}\nfrom ${socket.id}`);
        
        socket.on('message', (data) => {
            // only send message to partner if they have one
            // add message in current thread
        });

        // tell their partner that they have no more partner
        // also save to db if it hasn't been saved yet
        socket.on('disconnect', () => {
            
        });

        // make server add them to queue again
        socket.on('find-match', () => {

        });

        // set the thread to report their partner for abusing
        socket.on('report-partner', () => {

        });

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