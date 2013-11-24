var theCanvas = document.getElementById('canvas');
var context = theCanvas.getContext('2d');

// context.fillStyle = '#FFFFFF';
// context.fillRect(0, 0, theCanvas.width, theCanvas.height);
// context.strokeStyle = '#000000';
// context.strokeRect(0, 0, theCanvas.width, theCanvas.height);

var canvas = YustSdk.createApp('trackPad', 'drawpad', ['#FF0000', '#00FF00', '#0000FF', '#0FF000', '#000FF0', '#F0F000', '#F00F00', '#F000F0', '#F0000F']);
canvas
.on('trackPad', function( response ){
    context.fillStyle = response.p;
    context.beginPath();
    context.arc(response.v.x * theCanvas.width, response.v.y * theCanvas.height, 5, (Math.PI/180)*0, (Math.PI/180)*360, false);
    context.fill();
    context.closePath();
})
.on('clientPaired', function( response ){
    // $('.qrcontainer').hide('slow');
    // $('.qrcontainer').css('position', 'relative').animate();
})
.on('clientUnpaired', function( response ){
    // $('.qrcontainer').show('slow');
    // $('.qrcontainer').css('position', 'absolute').animate();
})
;