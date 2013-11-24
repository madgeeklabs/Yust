// O.o' Whaaaaat?
var io = require('socket.io-client');
var qr = require('qrcode-js');
var http = require('http');
var sys = require('sys');
var exec = require('child_process').exec;
var YustSDK = {};

(function(io, YustSDK){

    var serverIP = 'http://54.247.168.152:3000';

    function puts(error, stdout, stderr) { sys.puts(stdout) }

    var socket = io.connect( serverIP )
        , widget = 'control'
        , gameId = (function(){
            var text = ''
            , i
            , possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( i=0; i < 5; i++ ){
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        })()
        , qrImageBase64 = qr.toBase64("http://54.247.168.152/client/app?gameId=" + gameId, 4)
    ;

    YustSDK.init = function(){
        socket.on('connect', function (){
            socket.emit('createGame', {gameId: gameId, slots: ['player1'], type: 'trackPad' });
        });

        socket.on('clientPaired', function (data) {
            console.log('clientPaired', data);
        });

        socket.on('clientUnpaired', function (data) {
            console.log('clientUnpaired', data);
        });

        // switch para cada widget ?
        socket.on( 'trackPad', function (data) {
            console.log('data');
            // YustSDK.bind( data.m, data.t, data.v );
        });

        // Create the QR and serve it in localhost
        http.createServer(function(req, res) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<html><body><img src="data:image/jpeg;base64,')
            res.write(qrImageBase64);
            res.end('"/></body></html>');
        }).listen(3333);
        console.log('Listening in http://localhost:3333, go here and scan the qr code with your mobile!');

        exec("./MouseTools -x 300 -y 300", puts);
    };

    YustSDK.bind = function( event, timestamp, value ){
        console.log(event, timestamp, value);
        var keyDirection = value === 'r' ? 39 : 37;
        switch( event ){
            case 'press':
                // window.keysDown[keyDirection] = true;
                break;
            case 'release':
                // delete window.keysDown[keyDirection];
                break;
        }
    }

    return YustSDK;

})(io, YustSDK);

YustSDK.init();
