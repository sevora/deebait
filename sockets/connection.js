/**
 * This class is used to make multiple socket connections easier
 * as it enables one connection with multiple sockets pointing to the
 * same "user."
 */

class Connection {
    /**
     * To add sockets, use its addSocket method.
     */
    constructor() {
        this.sockets = {};
    }

    /**
     * Refers to a socket from socket.io
     * @param {*} socket 
     */
    addSocket(socket) {
        if (!this.sockets[socket.id]) {
            this.sockets[socket.id] = socket;
            this.sockets[socket.id].on('disconnect', (reason) => this.onSocketDisconnect(reason, socket));
            this.onRegisterSocket(this.sockets[socket.id]);
        }
    }

    /**
     * This simply uses the sockets' emit method,
     * meaning this emits to all sockets in a connection.
     * @param title String that is a title.
     * @param data String or Object.
     */
    emit(title, data) { 
        Object.values(this.sockets).forEach(socket => { socket.emit(title, data); }); 
    }

    /**
     * This is a private method.
     * @param reason 
     * @param socket 
     */
    onSocketDisconnect(reason, socket) {
        delete this.sockets[socket.id];

        if (Object.keys(this.sockets).length == 0) {
            this.onEmptySockets();
        }
    }

    /**
     * Use this to close the connection,
     * it just disconnects all of its sockets
     */
    disconnect() {
        Object.values(this.sockets).forEach(socket => { socket.disconnect(); }); 
    }

    // /**
    //  * Please implement this method
    //  * on extend.
    //  */
    // onEmptySockets() { 
    //     // define me  
    //     // this function runs when all of the sockets are disconnected
    // }

    // /**
    //  * Please implement this method on extend.
    //  * @param {*} socket 
    //  * @param {*} io 
    //  */
    // onRegisterSocket(socket, io) {
    //     // define me
    //     // this function runs whenever addSocket is called
    // }
}

module.exports = Connection;