var yustClient = (function (options) {
	'use strict';

	var socket,
		endId;

	function emit(event, value) {
		console.log(event, value, endId, socket);
		socket.emit(endId, {
			'm': event,
			't': new Date().getTime(),
			'v': value
		});
	}

	function create(options) {
		socket = io.connect(options.uri);
		endId = options.id;
	}

	function expose(fn) {
		return function () {
			if (!socket || !endId) {
				throw 'Error: yustClient not initialized!';
			} else {
				fn.apply(this, arguments);
				return this;
			}
		};
	}

	return {
		create: create,
		emit: expose(emit)
	};
}());