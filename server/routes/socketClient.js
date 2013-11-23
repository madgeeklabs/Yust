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
        socket.broadcast.to(gameId).emit('control', data);
    });

};
