
// To instantiate FastClick on the body, which is the recommended method of use:

// window.addEventListener('load', function() {
//     FastClick.attach(document.body);
// }, false);

/*
Don't forget to add a shim for addEventListener if you want to support IE8 and below.

Otherwise, if you're using jQuery:

$(function() {
    FastClick.attach(document.body);
});
*/

$(function() {
	var buttons = document.getElementsByClassName('button'),
		arrows = document.getElementsByClassName('arrows'),
		arrows_d = document.getElementsByClassName('arrows-d');

    FastClick.attach(document.body);

    for (var i = 0, j = buttons.length; i < j; i++) {
    	FastClick.attach(buttons[i]);	
    }

    for (var i = 0, j = arrows.length; i < j; i++) {
    	FastClick.attach(arrows[i]);	
    }

    for (var i = 0, j = arrows_d.length; i < j; i++) {
    	FastClick.attach(arrows_d[i]);	
    }
    
});