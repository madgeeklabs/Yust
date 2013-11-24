(function( YustSdk, window, undefined ){

    var serverIP =  'http://54.247.168.152:3000'
        , socket =  window.io.connect( serverIP ) // TODO: get script automatically
    ;

    function init( appType, appName, slots )
    {
        var appId = createId();
        getQrCode( appId );
        // Connect with the server
        socket.on('connect', function(){
            console.log('Waiting for connection...');
            socket.emit('createGame', {
                  appName: appName
                , appId: appId
                , slots: slots
                , type: appType
            });
        });

        return socket;
    };

    function createId()
    {
        // Create a new app id
        var text = ''
            , possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i = 0; i < 5; i++ ){
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    function getQrCode( appId )
    {
        // Create a QR code
        new window.QRCode("qrcode", {
            text: "http://54.247.168.152/client/app?appId=" + appId
            , width: 256
            , height: 256
            , colorDark : "#aa0000"
            , colorLight : "#ffffff"
            , correctLevel : window.QRCode.CorrectLevel.H
        })
    };

    YustSdk.createApp = function( type, name, slots )
    {
        return init( type, name, slots );
    }

})( YustSdk = window.YustSdk || {}, window );

// This is what a developer does...
var game = YustSdk.createApp('gamepad', 'pong', ['Player1']);

game
.on('gamepad', function( response ){
    // keyDirection is defined by pong.js (array of keys)
    var keyDirection;
    switch(response.v) {
        case 'r':
            keyDirection = 39
            break;
        case 'l':
            keyDirection = 37
            break;
    }
    if( response.p == 'Player1' ) {
        switch( response.m ){
            case 'press':
                window.keysDown[keyDirection] = true;
                break;
            case 'release':
                delete window.keysDown[keyDirection];
                break;
        }
    }
})
.on('clientPaired', function( response ){
    $('.qrcontainer').hide('slow');
})
.on('clientUnpaired', function( response ){
    $('.qrcontainer').show('slow');
})
;