/**
 * @file timeout.js
 * @date 6-25-2015
 *
 * Provides the global environment with a Timeout class for controlling
 * (and reusing) timeout events for any given callback function. A timeout
 * delay can be set or canceled through the class' set' and 'clear' methods.
 *
 * Timeout instances also expose a dynamic 'delay' property which can be used
 * to set, add, and subtract delay time from an active timeout. Adding positive
 * delay time to an inactive timeout will start a new timeout with the given
 * delay time. Subtracting positive delay time from an inactive timeout will
 * not begin a new timeout. Adding or subtracting zero time to an inactive
 * timeout will begin a new timeout that executes instantly.
 */
(function(window, undefined) {

	var setTimeout = window.setTimeout,
		clearTimeout = window.clearTimeout;
	
	function Timeout(fn, delay) {
		
		this._tid = null;
		this._callback = (typeof fn === "function") ? fn : function() {};
		this._delay = 0;
		this._startTime = null;

		if(typeof delay === "number") {
			this.set(parseInt(delay));
		}

	}
	
	Timeout.prototype.set = function(delay) {
		
		if(delay < 0 && this.delay === 0) {
			return;
		}

		this.clear();
		
		this._delay = parseInt(delay);
		
		this._tid = setTimeout(function() {
			this._callback();
			this._delay = 0;
			this._startTime = null;
		}.bind(this), this._delay);
		
		this._startTime = Date.now();

	};

	Timeout.prototype.clear = function() {
		if(this._tid !== null) {
			clearTimeout(this._tid);
			this._tid = null;
			this._delay = 0;
		}
	};

	Object.defineProperty(Timeout.prototype, 'delay', {
		
		enumerable: true,
		configurable: false,
		
		get: function() {
			var startTime = this._startTime || Date.now();
			return this._delay - (Date.now() - startTime);
		},
		
		set: function(delay) {
		    this.set(delay);
		}

	});

	window.Timeout = Timeout;
	
}(window));
