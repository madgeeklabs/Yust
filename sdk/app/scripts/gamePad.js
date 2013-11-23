(function(YustSDK, $, window, document, undefined){

    var serverIP = 'http://54.247.168.152:3000';
    var socket = window.io.connect( serverIP )
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
        , qrcode = new QRCode("qrcode", {
                text: "http://54.247.168.152/client/app?gameId=" + gameId
                , width: 256
                , height: 256
                , colorDark : "#aa0000"
                , colorLight : "#ffffff"
                , correctLevel : QRCode.CorrectLevel.H
            })
    ;

    YustSDK.init = function(){
        socket.on('connect', function(){
            socket.emit('createGame', {gameId:gameId});
        });

        socket.on('clientPaired', function(){
            $('.qrcontainer').hide();
        });

        socket.on('clientUnpaired', function(){
            $('.qrcontainer').show();
        });

        // switch para cada widget ?
        socket.on( widget, function (data) {
            YustSDK.bind( data.m, data.t, data.v );
        });
    };

    YustSDK.bind = function( event, timestamp, value ){
        var keyDirection = value === 'r' ? 39 : 37;
        switch( event ){
            case 'press':
                window.keysDown[keyDirection] = true;
                break;
            case 'release':
                delete window.keysDown[keyDirection];
                break;
        }
    }

    return YustSDK;

})(YustSDK = window.YustSDK || {}, jQuery, window, document);

YustSDK.init();
