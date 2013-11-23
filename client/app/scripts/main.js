(function () {
	'use strict';

	// Create the client and the connection
    var serverIP = 'http://54.247.168.152:3000';
	yustClient.create({ id: 'control', uri: serverIP });

	// Using jQuery for the hackathon speed needs lol
	$(document).on('ready', function () {
		function toggleButton(el, ev) {
			setTimeout(function () {
				yustClient.emit(ev, el.dataset.value);
				
				el.classList.toggle('is-active');
				if (el.dataset.shine) {
					document.get(el.dataset.shine).toggleClass('is-active');
				}
			}, 0);
		}

		$('.button, .arrow, .arrow-d').on('touchstart', function () {
				toggleButton(this, 'press');
		});

		$('.button, .arrow, .arrow-d').on('touchend', function () {
			toggleButton(this, 'release');
		});

		$(window).trigger('resize');
	});

	$(window).on('resize', function () {
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
		  $('meta[name=viewport]').attr('content',
		    'width=' + content_width + ',' +
		    'minimum-scale=' + viewport_scale + ', maximum-scale=' + viewport_scale);
	});

}());
