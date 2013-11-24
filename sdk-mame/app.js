// O.o' Whaaaaat?
var io = require('socket.io-client');
var qr = require('qrcode-js');
var http = require('http');
var sys = require('sys');
var exec = require('child_process').exec;
var YustSDK = {};

(function(io, YustSDK){

    var serverIP = 'http://54.247.168.152:3000',
        windowSize;

    function puts(error, stdout, stderr) { sys.puts(stdout) }

    var socket = io.connect( serverIP )
        , widget = 'control'
        , appId = (function(){
            var text = ''
            , i
            , possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( i=0; i < 5; i++ ){
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        })()
        , qrImageBase64 = qr.toBase64("http://54.247.168.152/client/app?appId=" + appId, 4)
    ;

    YustSDK.init = function(){
        socket.on('connect', function (){
            socket.emit('createGame', {appId: appId, slots: ['player1'], type: 'gamepad', appName: 'trackPad.node.js' });
        });

        socket.on('clientPaired', function (data) {
            // console.log('clientPaired', data);
        });

        socket.on('clientUnpaired', function (data) {
            // console.log('clientUnpaired', data);
        });

        var runningOrder;
        
        // switch para cada widget ?
        socket.on( 'gamepad', function (data) {
            // hardcoded screen resolution
            var order = "sudo python key.py ";
            var to_mame, to_mame_state;
            // console.log('data', data);
            switch (data.m) {
                case 'press':
                    to_mame_state = '1';
                    break;
                case 'release':
                    to_mame_state = '0';
                    break;
            } 
            switch (data.v) {
                case 'l':
                    to_mame = 'a';
                    break;
                case 'u':
                    to_mame = 'w';
                    break;
                case 'r':
                    to_mame = 'd';
                    break;
                case 'd':
                    to_mame = 's';
                    break;
                case 'x':
                    to_mame = '1';
                    break;
                case 'y':
                    to_mame = '2';
                    break;
                case 'a':
                    to_mame = '3';
                    break;
                case 'b':
                    to_mame = '4';
                    break;
            }
            order = order +"'"+ to_mame+"' '" + to_mame_state + "'";
             
            // console.log('order', order);
            exec(order, puts);

        });

        // Create the QR and serve it in localhost
        http.createServer(function(req, res) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<html><body style="text-align:center"><h1 style="font-size: 2em; margin: 2em; font-family: Helvetica, Arial; color: #666;">&iexcl;Scan this shit!</h1><img style="width: 300px" src="data:image/jpeg;base64,')
            res.write(qrImageBase64);
            res.end('"/></body></html>');
        }).listen(3333);
        console.log('Listening in http://localhost:3333, go here and scan the qr code with your mobile!');
    };

   

    return YustSDK;

})(io, YustSDK);

YustSDK.init();
