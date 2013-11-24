
/**
 * Module dependencies
 */

var express = require('express'),
  http = require('http');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var lodash  = require('lodash').noConflict();

io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
//io.set('log level', 0);                    // reduce logging

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);

// redirect all others to the index (HTML5 history)

// Socket.io Communication
var apps = {};
io.sockets.on('connection', function (socket) {
    //console.log('socket connected');
    

    socket.on('createGame', function(data){
        console.log('createGame', data);
        socket.appId = data.appId;
	socket.appName = data.appName;
        apps[socket.appId] = {slots:[], waitingSockets:[], gameSocket:socket, type:data.type};
        lodash.each(data.slots, function (playerName){
            apps[socket.appId].slots.push({playerName:playerName, playerSocket:undefined});
        });
        
        socket.join(socket.appId);
    });

    var assingSlot = function(socket){
            var freeSlots = lodash.filter(apps[socket.appId].slots, function(slot) {
		console.log('slot', slot);
                if(typeof(slot.playerSocket) == "undefined"){
                    return true;
                }else{
                    return false;
                }
            });
		console.log('freeslots',freeSlots);
		console.log('freeslots',freeSlots[0]);
            if (freeSlots.length > 0){
                freeSlots[0]['playerSocket'] = socket; 
                socket.playerName = freeSlots[0].playerName; 
                console.log('app joined');
                socket.join(socket.appId);
                apps[socket.appId].gameSocket.emit('clientPaired', {playerName:freeSlots[0].playerName});
		console.log('clientPaired',{success:true, type:apps[socket.appId].type});
                socket.emit('clientPaired', {success:true, type:apps[socket.appId].type});
            }else{
                socket.emit('clientPaired', {success:false, action:'wait'});
                apps[socket.appId].waitingSockets.push(socket); 
            }
    };

    socket.on('joinGame', function(data){
        console.log('app join attempt', data);
        socket.appId = data;
        if(typeof(apps[socket.appId]) !='undefined' ){
	    console.log('applalalala', apps[socket.appId]);
	    socket.on(apps[socket.appId].type, function (data2){
		console.log('event from client', data2);
		console.log('sending mesage to appId:', socket.appId);
		if(typeof(apps[socket.appId]) !='undefined' ){
			console.log(apps[socket.appId].type, data2);
			data2.p = socket.playerName;
			//io.sockets.in(appId).emit('control', data);
			console.log('---------------------------sendin=======',apps[socket.appId].gameSocket.appName);
			apps[socket.appId].gameSocket.emit(apps[socket.appId].type, data2);
		}else{
			console.log('app is dead ------------------------');
		}
	    });
            assingSlot(socket);     
        }else{
            //app does not exists
            socket.emit('app Closed','sorry');
        }
        
    });

    socket.on('disconnect', function(){
        if(typeof(socket.playerName) != 'undefined' && typeof(apps[socket.appId]) != 'undefined'){
	   console.log('disconnect true', socket);
            socket.volatile.broadcast.to(socket.appId).emit('clientUnpaired', {playerName:socket.playerName});
            var slotToRelease =  lodash.filter(apps[socket.appId].slots, function(slot){
                return  slot.playerName === socket.playerName;
            });
            if(slotToRelease.length > 0){
                slotToRelease[0].playerSocket = undefined;
	}
            if(apps[socket.appId].waitingSockets.length > 0){
		console.log('waiting sockets', apps[socket.appId].waitingSockets);
                assingSlot(apps[socket.appId].waitingSockets[0]);     
            }
        }else{
	   console.log('disconnect else', socket);
            delete apps[socket.appId];
            socket.emit('apps closed','sorry');
        } 
    });
 

});
//io.sockets.on('connection', require('./routes/socket'));

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
