var yustClient = (function (options) {
	'use strict';

	var socket,
        appId = getParameterByName('appId'),
        type;

	function emit(event, value) {
		console.log('emit', type, event, value)
		socket.emit(type, {
			'm': event,
			'v': value
		});
	}

	function create(options) {
		socket = io.connect(options.uri);
		
		socket.on('connect', function(){
	        console.log('connected!');
            console.log('joiingin game: ', appId);
	        socket.emit('joinGame', appId);
	    });

	    socket.on('clientPaired', function (data) {
	    	if (data.success) {
	    		type = data.type;

	    		if (type === 'trackPad') {
		    		var objToShow = $('.draw');
		    	} else {
		    		var objToShow = $('.pad');
		    	}
		    	
	    		$('.warning, .draw, .pad').addClass('is-hidden');
	    		objToShow.removeClass('is-hidden');
	    	} else {
	    		// TODO: show not connected screen
	    		console.log('No possible to connect!', data);
	    	}
	    });

	    socket.on('appClosed', function (data) {
	    	console.log('sorry');
	    });

	    socket.on('clientUnpaired', function(){
	        console.log('disconnected!');
	    });
	}

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

	function expose(fn) {
		return function () {
			if (!socket) {
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
