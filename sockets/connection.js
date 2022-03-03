/**
 *  This class is used to make connections easier
 */

class Connection {
    /**
     * 
     * @param {*} sockets 
     */
    constructor() {
        this.sockets = {};
    }

    /**
     * 
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
     * 
     * @param {*} title 
     * @param {*} data 
     */
    emit(title, data) { 
        Object.values(this.sockets).forEach(socket => { socket.emit(title, data); }); 
    }

    /**
     * 
     * @param {*} reason 
     * @param {*} socket 
     */
    onSocketDisconnect(reason, socket) {
        delete this.sockets[socket.id];

        if (Object.keys(this.sockets).length == 0) {
            this.onEmptySockets();
        }
    }

    disconnect() {
        Object.values(this.sockets).forEach(socket => { socket.disconnect(); }); 
    }

    // /**
    //  * 
    //  */
    // onEmptySockets() { 
    //     // define me  
    // }

    // /**
    //  * 
    //  * @param {*} socket 
    //  * @param {*} io 
    //  */
    // onRegisterSocket(socket) {
    //     // define me
    // }
}

module.exports = Connection;