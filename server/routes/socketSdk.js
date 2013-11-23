/*
 * Serve content over a socket
 */

var availableSockets = {};

module.exports = function (socket) {
  console.log('socket connected');
  console.log(socket.id);
  socket.join(socket.id);

};
