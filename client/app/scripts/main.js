(function () {
	'use strict';

	var yustClient = function (options) {
		var socket = io.connect(options.uri),
			endId = options.id;

		function emmit(event, value) {
			socket.emmit(endId, {
				'm': event,
				't': new Date().getTime(),
				'v': value
			});
		}

		return {
			emmit: emmit
		};
	};

	// Create the client and the connection
	yustClient({ id: 'mario', uri: 'http://54.247.168.152:3000' });

	// Using jQuery for the hackathon speed needs lol
	$(document).on('load', function () {
	 
		$('button').on('keydown', function () {
			yustClient.emit('pressStart', $(this).attr('data-value'));
		});

		$('button').on('keyup', function () {
			yustClient.emit('pressEnd', $(this).attr('data-value'));
		});
	   
	});

}());