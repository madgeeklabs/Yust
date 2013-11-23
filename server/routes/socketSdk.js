/*
 * Serve content over a socket
 */

var availableSockets = {};

module.exports = function (socket) {
  console.log('socket connected');
  console.log(socket.id);
  var gameId;
  socket.on('createGame', function(data){
      gameId = data.gameId;
      socket.join(data.gameId);
  });


  socket.on('joinGame', function(data){
      socket.join(data.gameId);
  });
    socket.on('joinGame', function(data){
        gameId = data.gameId;
        socket.join(gameId);
    });
 
    socket.on('control', function (data){
        socket.broadcast.to(gameId).emit('control', data);
    });

};
