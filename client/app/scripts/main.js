(function () {
	'use strict';

	// Create the client and the connection
    var serverIP = 'http://localhost:3000';
	yustClient.create({ id: 'mario', uri: serverIP });

	// Using jQuery for the hackathon speed needs lol
	$(document).on('ready', function () {
		function toggleButton(el, ev) {
			yustClient.emit(ev, el.attr('data-value'));
			
			el.toggleClass('is-active');
			if (el.attr('data-shine')) {
				$(el.attr('data-shine')).toggleClass('is-active');
			}
		}

		$('.button, .arrow').on('touchstart', function () {
			toggleButton($(this), 'press');
		});

		$('.button, .arrow').on('touchend', function () {
			toggleButton($(this), 'release');
		});
	});

}());
