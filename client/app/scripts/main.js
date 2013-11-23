(function () {
	'use strict';

	// Create the client and the connection
    var serverIP = 'http://localhost:3000';
	yustClient.create({ id: 'mario', uri: serverIP });

	// Using jQuery for the hackathon speed needs lol
	$(document).on('ready', function () {
		$('button').on('mousedown', function () {
			var $this = $(this);

			yustClient.emit('press', $this.attr('data-value'));
			
			$this.addClass('is-active');
			if ($this.attr('data-shine')) {
				$($this.attr('data-shine')).addClass('is-active');
			}
		});

		$('button').on('mouseup', function () {
			var $this = $(this);
			
			yustClient.emit('release', $this.attr('data-value'));

			$this.removeClass('is-active');
			if ($this.attr('data-shine')) {
				$($this.attr('data-shine')).removeClass('is-active');
			}
		});
	});

}());
