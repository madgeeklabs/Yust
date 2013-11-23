/*
 * Serve content over a socket
 */

module.exports = function (socket) {
 socket.on('mario', function (data){
        console.log('mario event!');
        console.log(data);
        socket.volatile.broadcast.emit('mario', data);
    });
};
