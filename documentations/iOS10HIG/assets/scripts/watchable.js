(function(window, undefined) {
	
	function identity(value) {
		
		return value;
		
	}
	
	function Watchable(setter, initialValue) {

		this._value = null;
		this._callbacks = [];
		this._setter = !!(typeof setter === "function") ? setter : identity;
		
		if(typeof initialValue !== "undefined") {
			this.set(initialValue);
		}

	}

	Watchable.prototype.get = function() {
		
		return this._value;

	};

	Watchable.prototype.set = function(value) {
		
		// (Possibly) mutate the '_value' property through the provided setter
		value = this._setter.call(this, value);
		
		// Only invoke callbacks if an actual value change occurs
		if(typeof value !== "undefined" && value !== this._value) {
		
			var oldValue = this._value;
			
			this._value = value;

			for(var i = this._callbacks.length; i--;) {
				
				// Passing 'this._value' to allow sequential mutations
				this._callbacks[i](this._value, oldValue);
				
			}

		}
		
		return this._value;

	};

	Watchable.prototype.addCallback = function(callback) {
		
		var i;
		
		if(arguments.length > 1) {
			arguments[0] = Array.prototype.slice.call(arguments, 0);
		}
		
		if(callback instanceof Array) {
			for(i = callback.length; i--;) {
				this.addCallback.call(this, callback[i]);
			}
			return;
		}
		
		if(typeof callback === "function") {
			var exists = false;
			for(i = this._callbacks.length; i--;) {
				if(this._callbacks[i] === callback) {
					exists = true;
				}
			}
			if(!exists) {
				this._callbacks.push(callback);
			}
		}
		
	};

	Watchable.prototype.removeCallback = function(callback) {
		
		var i;
		
		if(arguments.length > 1) {
			arguments[0] = Array.prototype.slice.call(arguments, 0);
		}
		
		if(callback instanceof Array) {
			for(i = callback.length; i--;) {
				this.removeCallback.call(this, callback[i]);
			}
			return;
		}
		
		for(i = this._callbacks.length; i--;) {
			if(this._callbacks[i] === callback) {
				this._callbacks = this._callbacks.splice(i, 1);
				return;
			}
		}
		
	};

	// Expose the Watchable constructor as a global function
	window.Watchable = Watchable;

}(window));
