
/**
 * Module dependencies
 */

var express = require('express'),
  http = require('http');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('lodash');

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
        apps.appId = {slots:[], waitingSockets:[], gameSocket:socket};
        _.each(data.slots, function (playerName){
            apps.appId.slots.push({playerName:playerName, playerSocket:undefined});
        });
        
        socket.join(appId);
    });

    var assingSlot = function(socket){
            var freeSlots = _.first(apps.appId.slots, function(slot) {
                if(typeof(slot.playerSocket) == "undefined"){
                    return true;
                }else{
                    return false;
                }
            });
            if (freeSlots){
                freeSlots[0].playerSocket = socket; 
                socket.playerName = freeSlots[0].playerName; 
                console.log('app joined', data);
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
        if(apps.appId){
            assingSlot(socket);     
        }else{
            //app does not exists
            socket.emit('app Closed','sorry');
        }
        
    });

    socket.on('disconnect', function(){
        if(socket.playerName){
            socket.volatile.broadcast.to(appId).emit('clientUnpaired', {playerName:socket.playerName});
            var slotToRelease =  _.first(apps.appId.slots, function(slot){
                return  slot.playerName === socket.playerName;
            });
            if(slotToRelease){
                slotToRelease.playerSocket = undefined;
            }
            if(apps.appId.waitingSockets){
                assingSlot(apps.appId.waitingSockets[0]);     
            }
        }else{
            delete apps.appId;
            socket.emit('apps closed','sorry');
        } 
    });
 
    socket.on('control', function (data){
        console.log('control', data);
        console.log('sending mesage to appId:', appId);
        data.p = socket.playerName;
        //io.sockets.in(appId).emit('control', data);
        apps.appId.emit('control', data);
    });

});
//io.sockets.on('connection', require('./routes/socket'));

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
