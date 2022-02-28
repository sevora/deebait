/**
 *  This class is used to make connections easier
 */

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

    emit(title, data) { this.sockets.forEach(socket => { socket.emit(title, data); }); }

    socketDisconnectHandler(reason, socket) {
        // console.log(`Connected ID: ${this.document.userID} Removed: ${socket.id}`);

        for (let index = this.sockets.length-1; index >= 0; --index) {
            if (this.sockets[index].id == socket.id) this.sockets.splice(index, 1);
        }

        if (this.sockets.length == 0) {
            this.deleteInstance();
        }
    }

    deleteInstance() { 
        // define me  
    }

    registerEventHandlers(socket, io) {
        // define me
    }
}

module.exports = Connection;