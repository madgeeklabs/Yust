(function(YustSDK, $, window, document, undefined){

    var serverIP = 'http://54.247.168.152:3000';
    var   socket
        , widget = 'mario'
    ;

    YustSDK.init = function(){
        console.log('// Connecting...');
        socket = window.io.connect( serverIP);

        var gameId = Math.random();

        socket.on('connect', function(){
            console.log('conected!'); 
            var qrcode = new QRCode("qrcode", {
                text: "http://54.247.168.152:3000/client/app?id=" + gameId,
                width: 128,
                height: 128,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
            socket.emit('joinGame', {gameId:socket.id});
        });
        // switch para cada widget ?
        socket.on( widget, function (data) {
            console.log('// Receiving data');
            console.log( data );
            YustSDK.bind( data.m, data.t, data.v );
        });
    };

    YustSDK.bind = function( event, timestamp, value ){
        console.log('// Binding event...');
        var keyDirection = value == 'r' ? 39 : 37;
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
