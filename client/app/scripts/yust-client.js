var yustClient = (function (options) {
	'use strict';

	var socket,
		endId,
        gameId = getParameterByName('gameId');

	function emit(event, value) {
		socket.emit(endId, {
			'm': event,
			'v': value
		});
	}

	function create(options) {
		socket = io.connect(options.uri);
		socket.on('connect', function(){
	        console.log('connected!');
            console.log('joiingin game: ', gameId);
	        socket.emit('joinGame', gameId);
	    });
	    socket.on('clientUnpaired', function(){
	        console.log('disconnected!');
	    });

	    endId = options.id;
	}

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
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
