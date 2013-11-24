
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
    
    var appId;
        

    socket.on('createGame', function(data){
        console.log('createGame', data);
        appId = data.appId;
        apps.appId = {slots:[], waitingSockets:[], gameSocket:socket, type:data.type};
        lodash.each(data.slots, function (playerName){
            apps.appId.slots.push({playerName:playerName, playerSocket:undefined});
        });
        
        socket.join(appId);
    });

    var assingSlot = function(socket){
            var freeSlots = lodash.first(apps.appId.slots, function(slot) {
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
                socket.join(appId);
                apps.appId.gameSocket.emit('clientPaired', {playerName:freeSlots[0].playerName});
                socket.emit('clientPaired', {success:true});
            }else{
                socket.emit('clientPaired', {success:false, action:'wait'});
                apps.appId.waitingSockets.push(socket); 
            }
    };

    socket.on('joinGame', function(data){
        console.log('app join attempt', data);
        appId = data;
        if(typeof(apps.appId) !='undefined' ){
	    socket.on(apps.appId.type, function (data2){
		console.log('event from client', data2);
		console.log('sending mesage to appId:', appId);
		data.p = socket.playerName;
		//io.sockets.in(appId).emit('control', data);
		apps.appId.gameSocket.emit(data.type, data2);
	    });
            assingSlot(socket);     
        }else{
            //app does not exists
            socket.emit('app Closed','sorry');
        }
        
    });

    socket.on('disconnect', function(){
        if(typeof(socket.playerName) != 'undefined' && typeof(apps.appId) != 'undefined'){
	   console.log('disconnect true', socket);
            socket.volatile.broadcast.to(appId).emit('clientUnpaired', {playerName:socket.playerName});
            var slotToRelease =  lodash.first(apps.appId.slots, function(slot){
                return  slot.playerName === socket.playerName;
            });
            if(slotToRelease.length > 0){
                slotToRelease[0].playerSocket = undefined;
            }
            if(apps.appId.waitingSockets.length > 0){
		console.log('waiting sockets', apps.appId.waitingSockets);
                assingSlot(apps.appId.waitingSockets[0]);     
            }
        }else{
	   console.log('disconnect else', socket);
            delete apps.appId;
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
