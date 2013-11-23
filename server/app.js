
/**
 * Module dependencies
 */

var express = require('express'),
  http = require('http');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
//io.set('log level', 0);                    // reduce logging

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
   a = 1;
}



// redirect all others to the index (HTML5 history)

// Socket.io Communication
io.sockets.on('connection', function (socket) {
    //console.log('socket connected');
    
    var gameId;

    socket.on('createGame', function(data){
        console.log('createGame', data);
        gameId = data.gameId;
        socket.join(gameId);
    });

    socket.on('joinGame', function(data){
        console.log('game joined', data);
        gameId = data;
        socket.join(gameId);
    });
 
    socket.on('control', function (data){
        console.log('control', data);
        console.log('sending mesage to gameId:', gameId);
        io.sockets.in(gameId).emit('control', data);
        //socket.volatile.broadcast.to(gameId).emit('control', data);
    });

});
//io.sockets.on('connection', require('./routes/socket'));

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
