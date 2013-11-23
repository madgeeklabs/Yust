/*
 * Serve content over a socket
 */

var availableSockets = {};

module.exports = function (socket) {
    //console.log('socket connected');
    
    var gameId;

    socket.on('createGame', function(data){
        console.log('createGame', data);
        gameId = data.gameId;
        socket.join(gameId);
    });

    socket.on('joinGame', function(data){
        console.log('game joined', data);
        gameId = data.gameId;
        socket.join(gameId);
    });
 
    socket.on('control', function (data){
        console.log('control', data);
        console.log('sending mesage to gameId:', gameId);
        io.sockets.in(gameId).emit('control', data);
        //socket.volatile.broadcast.to(gameId).emit('control', data);
    });

};
