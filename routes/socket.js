module.exports = function(socket, io) {

    socket.on('message', function(data) {
        console.log(socket.handshake.headers);
    });

}