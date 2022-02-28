/**
 *  This class is used to make connections easier
 */

class Connection {
    /**
     * 
     * @param {*} sockets 
     */
    constructor(sockets) {
        this.sockets = [];

        sockets.forEach(socket => {
            this.addSocket(socket);
        });
    }

    /**
     * 
     * @param {*} socket 
     */
    addSocket(socket) {
        let index = this.sockets.map(socket => socket.id).indexOf(socket.id);
        
        if (index == -1) {
            socket.on('disconnect', (reason) => this.onSocketDisconnect.bind(this)(reason, socket));
            this.sockets.push(socket);
            index = this.sockets.length-1;  
        } 

        this.onRegisterSocket(this.sockets[index]);
    }

    /**
     * 
     * @param {*} title 
     * @param {*} data 
     */
    emit(title, data) { this.sockets.forEach(socket => { socket.emit(title, data); }); }

    /**
     * 
     * @param {*} reason 
     * @param {*} socket 
     */
    onSocketDisconnect(reason, socket) {
        for (let index = this.sockets.length-1; index >= 0; --index) {
            if (this.sockets[index].id == socket.id) this.sockets.splice(index, 1);
        }

        if (this.sockets.length == 0) {
            this.onEmptySockets();
        }
    }

    /**
     * 
     */
    onEmptySockets() { 
        // define me  
    }

    /**
     * 
     * @param {*} socket 
     * @param {*} io 
     */
    onRegisterSocket(socket) {
        // define me
    }
}

module.exports = Connection;