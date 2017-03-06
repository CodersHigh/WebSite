'use strict';

(function(window, $, undefined) {
	
	// Constants
	
	var SCROLL_EVENT_TYPES = [
		'DOMMouseScroll',
		'mousewheel'
	];
	
	var SCROLL_DIRECTIONS = {};
		
	SCROLL_DIRECTIONS.UP = -1;
	SCROLL_DIRECTIONS.DOWN = 1;
	
	// Utility functions
	
	function isNegative(n) {
		
		return (1 / n) < 0; // (n = +n) || 
		// See: http://cwestblog.com/2014/02/25/javascript-testing-for-negative-zero/
		
	}
	
	function isScrollEvent(e) {
		
		return !!(SCROLL_EVENT_TYPES.indexOf(e.type) > -1);
		
	}
	
	function cancelEvent(e) {
	
		e.preventDefault();
		
		e.stopImmediatePropagation();
		
		e.stopPropagation();
		
		e.returnValue = false;
		
		return false;
		
	}
	
	function preventScrollPropagation(selector) {
		
		$(document).on(SCROLL_EVENT_TYPES.join(' '), selector, function(e) {
				
			var target = $(e.currentTarget);
			
			var scrollTop 		= target.get(0).scrollTop,
				scrollHeight 	= target.get(0).scrollHeight,
				height 			= target.height();
				
			var scrollBottom 	= scrollHeight - height - scrollTop,
				scrollDelta 	= e.originalEvent.deltaY;
			
			// Determine scroll direction
					
			var direction = scrollDelta / Math.abs(scrollDelta);
			
			if(!direction) {
				direction = (isNegative(direction)) ?
					SCROLL_DIRECTIONS.DOWN :
					SCROLL_DIRECTIONS.UP;
			}
			
			if((direction === SCROLL_DIRECTIONS.UP && scrollTop <= 0) ||
				(direction === SCROLL_DIRECTIONS.DOWN && scrollBottom <= 0)) {
				
				return cancelEvent(e);
				
			}
			
		});
		
	}
	
	// Prototype extension
	
	if(typeof $.fn.preventScrollPropagation !== 'function') {
		$.preventScrollPropagation = preventScrollPropagation;
	}
	
}(window, window.jQuery));