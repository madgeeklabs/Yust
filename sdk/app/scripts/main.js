(function(YustSDK, $, window, document, undefined){

    var serverIP = 'http://54.247.168.152:3000';
    var   socket
        , widget = 'mario'
    ;

    YustSDK.init = function(){
        console.log('// Connecting...');
        socket = window.io.connect( serverIP );

        // switch para cada widget ?
        socket.on( widget, function (data) {
            console.log('// Receiving data');
            console.log( data );
            YustSDK.bind( data.m, data.t, data.v );
        });
    };

    YustSDK.bind = function( event, timestamp, value ){
        console.log('// Binding event...');

    }

    return YustSDK;

})(YustSDK = window.YustSDK || {}, jQuery, window, document);

YustSDK.init();