(function () {
	'use strict';

	// Create the client and the connection
	// yustClient.create({ id: 'mario', uri: 'http://54.247.168.152:3000' });
	yustClient.create({ id: 'mario', uri: 'http://localhost:3000' });

	// Using jQuery for the hackathon speed needs lol
	$(document).on('ready', function () {
		$('button').on('mousedown', function () {
			yustClient.emit('pressStart', $(this).attr('data-value'));
		});

		$('button').on('mouseup', function () {
			yustClient.emit('pressEnd', $(this).attr('data-value'));
		});
	   
	});

}());