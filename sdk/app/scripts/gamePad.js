/*
(function(YustSdk, window, undefined){

    var serverIP =  'http://54.247.168.152:3000';
    var socket =    window.io.connect( serverIP ) // TODO: get script automatically
        , appId =   YustSdk.createId
    ;

    YustSdk.init = function( appType )
    {
        // Connect with the server
        socket.on('connect', function(){
            console.log('Waiting for connection...');
            socket.emit('createGame', { appId: appId });
            // trigger the 'connect' event in the app
        });

        // Both client and server are paired and ready
        socket.on('clientPaired', function(){
            console.log('Paired!');
            // trigger the 'paired' event in the app
        });

        // Communication between client and server is broken
        socket.on('clientUnpaired', function(){
            console.log('Unpaired :(');
            // trigger the 'unpaired' event in the app
        });
    };

    YustSdk.createId = function()
    {
        // Create a new app id
        var text = ''
            , possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i = 0; i < 5; i++ ){
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    YustSdk.getQrCode = function()
    {
        //
    };

})(YustSdk = window.YustSdk || {}, window);

var $Yust = (function( sdk ){
    var yust = {};

    yust.createApp = function( type ){
        sdk.init( type );
    }

    return yust;
})( YustSdk );

var gamepad = $Yust.createApp('gamepad');
*/
// gamepad
//     .press('joystick', function( direction ){

//     })
//     .release('joystick', function(){

//     })


(function(YustGamePad, $, window, document, undefined){

    var serverIP = 'http://54.247.168.152:3000';
    var socket = window.io.connect( serverIP )
        , widget = 'control'
        , appId = (function(){
            var id = ''
            , possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < 5; i++ ){
                id += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return id;
        })()
        , qrcode = new QRCode("qrcode", {
                text: "http://54.247.168.152/client/app?appId=" + appId
                , width: 256
                , height: 256
                , colorDark : "#aa0000"
                , colorLight : "#ffffff"
                , correctLevel : QRCode.CorrectLevel.H
            })
    ;

    YustGamePad.init = function(){
        socket.on('connect', function(){
            socket.emit('createGame', {
                  appId: appId
                , slots: ['Human']
            });
        });

        socket.on('clientPaired', function( response ){
            if( response.success === true ){
                console.log(response.playerName);
                $('.qrcontainer').hide();
            }
        });

        socket.on('clientUnpaired', function( response ){
            console.log(response.playerName);
            $('.qrcontainer').show();
        });

        // switch para cada widget ?
        socket.on( widget, function (data) {
            YustGamePad.bind( data.m, data.t, data.v, data.p );
        });
    };

    YustGamePad.bind = function( event, timestamp, value, name ){
        var keyDirection = value === 'r' ? 39 : 37;
        switch( event ){
            case 'press':
                console.log( 'The user: ' + name);
                window.keysDown[keyDirection] = true;
                break;
            case 'release':
                console.log( 'The user: ' + name);
                delete window.keysDown[keyDirection];
                break;
        }
    }

    return YustGamePad;

})(YustGamePad = window.YustGamePad || {}, jQuery, window, document);

YustGamePad.init();
