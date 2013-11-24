(function () {
	'use strict';

	// Create the client and the connection
    var serverIP = 'http://54.247.168.152:3000',
    	states = {};

	yustClient.create({ uri: serverIP });

	// Using jQuery for speed purposes in the hackaton lol
	$(document).on('ready', function () {
		function toggleButton(el, ev) {
			if (!states[el] || states[el] !== ev) {
				states[el] = ev;
			} else {
				return;
			}
			
			setTimeout(function () {
				yustClient.emit(ev, el.dataset.value);
			}, 0);
			
			el.classList.toggle('is-active');
		}

		function emitMousePosition(x, y) {
			yustClient.emit('mousMoveTo',{'x': x, 'y': y});
		}

		$('.button, .arrow, .arrow-d').on('touchstart', function () {
				toggleButton(this, 'press');
		});

		$('.button, .arrow, .arrow-d').on('touchend', function () {
			toggleButton(this, 'release');
		});

		document.getElementById('draw').addEventListener('touchstart', function(e) {
			yustClient.emit('mouseDown', { 'x': e.changedTouches[0].pageX, 'y': e.changedTouches[0].pageY });
	    }, false);

	    document.getElementById('draw').addEventListener('touchend', function(e) {
			yustClient.emit('mouseUp', { 'x': e.changedTouches[0].pageX, 'y': e.changedTouches[0].pageY });
	    }, false);

	    document.getElementById('draw').addEventListener('touchmove', function(e) {
	        e.preventDefault();
			yustClient.emit('mouseMoveTo', { 'x': e.changedTouches[0].pageX, 'y': e.changedTouches[0].pageY })
	    }, false);
	});

	// Setting the viewport to see it in every device
	var viewport = $('meta[name=viewport]');
	window.onresize = function () {
		var content_width, screen_dimension;

		  if (window.orientation == 0 || window.orientation == 180) {
		    // portrait
		    content_width = 630;
		    screen_dimension = screen.width * 0.98; // fudge factor was necessary in my case
		  } else if (window.orientation == 90 || window.orientation == -90) {
		    // landscape
		    content_width = 950;
		    screen_dimension = screen.height;
		  }

		  var viewport_scale = screen_dimension / content_width;

		  // resize viewport
		  viewport.attr('content',
		    'width=' + content_width + ',' +
		    'minimum-scale=' + viewport_scale + ', maximum-scale=' + viewport_scale);
	};
	window.onload = function () {
		$(window).resize(); 
	}

}());
