/*
 * Serve content over a socket
 */

module.exports = function (socket) {
    var gameId;
    socket.on('joinGame', function(data){
        gameId = data.gameId;
        socket.join(gameId);
    });
 
    socket.on('control', function (data){
        io.sockets.sockets(openGames.).emit('message', 'for your eyes only');
        socket.volatile.broadcast.to(gameId).emit('event_name', data)
        socket. 
        console.log('mario event!');
        console.log(data);
        socket.volatile.broadcast.emit('mario', data);
    });

    socket.on('disconnect', function() {
        delete availableSockets[socket.id];
    });
};
