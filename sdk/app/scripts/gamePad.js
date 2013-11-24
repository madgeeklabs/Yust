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
    $('#canvas').show('slow');
})
.on('clientUnpaired', function( response ){
    $('#canvas').hide('slow');
})
;