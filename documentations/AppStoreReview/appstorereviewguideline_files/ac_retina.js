/* ---- BUILT FILE. DO NOT MODIFY THIS DIRECTLY. ---- */

if (!Function.prototype.bind) {
	Function.prototype.bind = function bind() {
		if (arguments.length < 2 && typeof(arguments[0]) == undefined) {
			return this;
		}
		var __method = this,
			args = AC.Array.toArray(arguments),
			object = args.shift();
		return function () {
			return __method.apply(object, args.concat(AC.Array.toArray(arguments)));
		}
	};
}
if (!Array.isArray) {
	Array.isArray = function isArray(object) {
		return (object && typeof object === 'object' && 'splice' in object && 'join' in object);
	};
}
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function forEach(callback, thisObj) {
		var arrayObject = Object(this),
			len = this.length,
			i = 0,
			currentValue;
		if (typeof callback !== 'function') {
			throw 'No function object passed to forEach.';
		}
		for (i = 0; i < len; i++) {
			currentValue = arrayObject[i];
			callback.call(thisObj, currentValue, i, arrayObject);
		}
	};
}
if (!String.prototype.trim) {
	String.prototype.trim = function trim() {
		return this.replace(/^\s+|\s+$/g, '');
	};
}
if (!Object.keys) {
	Object.keys = function keys(obj) {
		var keys = [],
			currentKey;
		if ((!obj) || (typeof obj.hasOwnProperty !== 'function')) {
			throw 'Object.keys called on non-object.';
		}
		for (currentKey in obj) {
			if (obj.hasOwnProperty(currentKey)) {
				keys.push(currentKey);
			}
		}
		return keys;
	};
}
if (!Object.create) {
	Object.create = function (o) {
		if (arguments.length > 1) {
			throw new Error('Object.create implementation only accepts the first parameter.');
		}
		function F() {}
		F.prototype = o;
		return new F();
	};
}
;
var AC = window.AC || {};
AC.Array = AC.Array || {};
AC.Array.toArray = function (arrayLike) {
	return Array.prototype.slice.call(arrayLike);
};
AC.Array.flatten = function (array) {
	var flattenedArray = [];
	var callback = function(item) {
		if (Array.isArray(item)) {
			item.forEach(callback);
		} else {
			flattenedArray.push(item);
		}		
	}
	array.forEach(callback);
	return flattenedArray;
};
var AC = window.AC || {};
AC.Element = AC.Element || {};
AC.Element.addEventListener = function(target, type, listener) {
	if (target.addEventListener) {
		target.addEventListener(type, listener, false);
	}
	else if (target.attachEvent) {
		var r =target.attachEvent("on" + type, listener);
	}
	else {
		target["on" + type] = listener;
	}
	return target;
};
AC.Element.removeEventListener = function(target, type, listener) {
	if (target.removeEventListener) {
		target.removeEventListener(type, listener, false);
	}
	else {
		target.detachEvent("on" + type, listener);
	}
	return target;
};
AC.Element.getElementById = function (elem) {
	if (AC.String.isString(elem)) {
		return document.getElementById(elem);
	} else {
		return elem;
	}
};
AC.Element.getStyle = function (element, style) {
	element = AC.Element.getElementById(element);
	style = style == 'float' ? 'cssFloat' : style;
	var value = element.style[style];
	if (!value || value == 'auto') {
		var css = document.defaultView.getComputedStyle(element, null);
		//Keys in computed style hash are expected to be camel-case in Firefox
		//(Chrome and Safari seem to support both camel-case and hyphenated property names)
		//value = css ? css[style] : null;
		if(css) {
			if(typeof(css[style]) != 'undefined') {
				value = css[style]
			} else if(style.indexOf('-') > -1) {
				var camelCaseStyle = style.replace(/-(\w)/g, function(all, letter) {
					return letter.toUpperCase();
				});
				if(typeof(css[camelCaseStyle]) != 'undefined') {
					value = css[camelCaseStyle]
				}
			} else {
				value = null;
			}
		}
	}
	if (style == 'opacity') return value ? parseFloat(value) : 1.0;
	return value == 'auto' ? null : value;
};
AC.Element.hasClassName = function (element, cls) {
	var matchedElement = AC.Element.getElementById(element);
	if (matchedElement && matchedElement.className) {
		return matchedElement && matchedElement.className && matchedElement.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')) || false;
	}
};
AC.Element.addClassName = function (element, cls) {
	var matchedElement = AC.Element.getElementById(element);
	if (!AC.Element.hasClassName(matchedElement, cls)) {
		matchedElement.className += " " + cls;
	}
};
AC.Element.removeClassName = function (element, cls) {
	var matchedElement = AC.Element.getElementById(element);
	if (AC.Element.hasClassName(matchedElement,cls)) {
		var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		matchedElement.className = matchedElement.className.replace(reg, '');
	}
};
var AC = window.AC || {};
AC.Event = AC.Event || {};
AC.Event.stop = function (evt) {
	if (!evt) {
		evt = window.event;
	}
	if (evt.stopPropagation) {
		evt.stopPropagation();
	} else { 
		evt.cancelBubble = true;
	}
	if (evt.preventDefault) {
		evt.preventDefault();
	}
	evt.stopped = true;
};
AC.Event.target = function(evt) {
	return (typeof evt.target != 'undefined') ? evt.target : evt.srcElement;	
};
var AC = window.AC || {};
AC.Function = AC.Function || {};
AC.Function.emptyFunction = function () {};
AC.Function.bindAsEventListener = function (__method) {
	var args = AC.Array.toArray(arguments), object = args.shift();
	return function(event) {
		return __method.apply(object, [event || window.event].concat(args));
	};
}
;
var AC = window.AC || {};
AC.Object = AC.Object || {};
if (Object.extend) {
	AC.Object.extend = Object.extend;
} else {
	AC.Object.extend = function extend(destination, source) {
		for (var property in source) {
			destination[property] = source[property];
		}
		return destination;
	};
}
if (Object.clone) {
	AC.Object.clone = Object.clone;
} else {
	AC.Object.clone = function clone(object) {
		return AC.Object.extend({}, object);
	};
}
;
var AC = window.AC || {};
AC.String = AC.String || {};
AC.String.isString = function (object) {
	return typeof object == "string";
}
;
var AC = window.AC || {};
AC.Object.extend(AC, {
	uid: function ac_uid() {
		if (!AC._uid) {
			AC._uid = 0;
		}
		return AC._uid++;
	},
	log: function ac_log(message) {
		if (window.console && console.log) {
			console.log(message);
		}
	},
	namespace: function ac_namespace(innamespacePath) {
		if (!(innamespacePath && innamespacePath.match && innamespacePath.match(/\S/))) {
			throw 'Attempt to create AC.namespace with no name.';
		}
		var splitnamespaceArr = innamespacePath.split(/\./),
			cursor = window;
		for (i = 0; i < splitnamespaceArr.length; i++) {
			cursor[splitnamespaceArr[i]] = cursor[splitnamespaceArr[i]] || {};
			cursor = cursor[splitnamespaceArr[i]];
		}
	},
	bindEventListeners: function ac_bindEventListeners(inObject, inElement, inHandlerDictionary) {
		var elm = AC.Element.getElementById(inElement);
		if (!(elm && elm.nodeType)) {
			throw 'Invalid or non-existent element passed to bindEventListeners.';
		}
		for (aKey in inHandlerDictionary) {
			var aVal = inHandlerDictionary[aKey];
			if (typeof aVal == 'function') {
				AC.Element.addEventListener(elm, aKey, AC.Function.bindAsEventListener(aVal, inObject));
			}
			else if (typeof aVal == 'string') {
				AC.Element.addEventListener(elm, aKey, AC.Function.bindAsEventListener(inObject[aVal], inObject));
			}
		}
	}
});
AC.Object.extend(AC, {
	__domReady: function ac___domReady() {
		if (arguments.callee.done) return;
		arguments.callee.done = true;
		if (this._timer) clearInterval(this._timer);
		AC.isDomReady = true;
		if (AC.__domReadyCallbacks) AC.__domReadyCallbacks.forEach(function (f) {
			f()
		});
		AC.__domReadyCallbacks = null;
	},
	onDOMReady: function ac_onDOMReady(f) {
		if (AC.isDomReady) {
			f();
		} else {
			if (!AC.__domReadyCallbacks) {
				var domReady = this.__domReady.bind(this);
				if (document.addEventListener) document.addEventListener("DOMContentLoaded", domReady, false);
				if (document.all) {
					document.onreadystatechange = function () {
						if (this.readyState == "complete") domReady();
					};
				}
				if (/WebKit/i.test(navigator.userAgent)) {
					this._timer = setInterval(function () {
						if (/loaded|complete/.test(document.readyState)) domReady();
					}, 10);
				}
				AC.Element.addEventListener(window, 'load', domReady);
				AC.__domReadyCallbacks = [];
			}
			AC.__domReadyCallbacks.push(f);
		}
	}
});
AC.windowHasLoaded = false;
AC.Element.addEventListener(window, 'load', function () {
	AC.windowHasLoaded = true;
});
AC.namespace('AC.Synthesize');
AC.Synthesize.synthesize = function (object) {
	if (typeof object !== 'object') {
		object = this;
	}
	var name, privateVariable;
	// Check all properties under object, ignore inherited properties
	for (privateVariable in object) {
		if (object.hasOwnProperty(privateVariable)) {
			// Check that first character is private variable indicator '_' and not '__'
			if (privateVariable.charAt(0) === '_' && !(privateVariable.charAt(1) === '_')) {
				// Don't create getter/setters for functions
				if (typeof object[privateVariable] !== 'function') {
					this.__synthesizeGetter(privateVariable, object);
					this.__synthesizeSetter(privateVariable, object);
				}
			}
		}
	}
};
AC.Synthesize.__synthesizeGetter = function (privateVariable, object) {
	// Get name of getter function
	var functionName = privateVariable.slice(1, privateVariable.length);
	// Define getter if not already defined
	if (typeof object[functionName] === 'undefined') {
		object[functionName] = function () {
			return object[privateVariable];
		}
	}
};
AC.Synthesize.__synthesizeSetter = function (privateVariable, object) {
	var functionName = privateVariable.slice(1, privateVariable.length);
	functionName = 'set' + functionName.slice(0, 1).toUpperCase() + functionName.slice(1, functionName.length);
	// Define setter if not already defined
	if (typeof object[functionName] === 'undefined') {
		object[functionName] = function (value) {
			object[privateVariable] = value;
		}
	}
};
AC.namespace('AC.Object');
AC.Object.synthesize = function (object) {
	if (typeof object === 'object') {
		// Create new instance of AC.Synthesize and extend it with your object
		AC.Object.extend(object, AC.Object.clone(AC.Synthesize));
		// Synthesize member data in extended object
		object.synthesize();
		return object;
	} else {
		throw 'Argument supplied was not a valid object.';
		return object;
	}
};
AC.Class = function (inOptInstantiateOnAwakeFromPage) {
	var ACGeneratedClass = function () {
		// Create placeholder methods for methods which need to be implemented in subclasses.
		// These placeholders throw descriptive exceptions.
		if (Array.isArray(this._subclassPlaceholders)) {
			for (var i = 0; i < this._subclassPlaceholders.length; i++) {
				var placeholder = this._subclassPlaceholders[i];
				if (!this[placeholder]) {
					this[placeholder] = function () {
						throw 'Subclasses must implement ' + placeholder + '.';
					}
				}
			}
		}
		// fill in missing accessors
		AC.Object.synthesize(this);
		this.superclass = function () {
			if (!this.__superclass) {
				throw 'Attempted to call superclass() within an instance whose class was not built using AC.Subclass.';
			}
			// auto-create closure depth keys
			if (!this.__closureDepths) {
				this.__closureDepths = {};
			}
			var superclassObj = {};
			var thisAsPlainObj = this;
			for (var aKey in thisAsPlainObj) {
				if (aKey != 'superclass' && aKey != '__superclass' && typeof this[aKey] == 'function') {
					var currentClosureDepth = this.__closureDepths[aKey] || 0;
					var cursor = this;
					var depth = 0;
					while (cursor && (depth <= currentClosureDepth)) {
						cursor = cursor.__superclass;
						if (cursor && cursor.prototype && typeof cursor.prototype[aKey] == 'function') {
							depth++;
						}
					}
					// if we still have a cursor, we found a function
					if (cursor) {
						// create a wrapper that temporarily increments the closure depth and binds to this
						var keyForClosure = '' + aKey;
						var depthForClosure = depth - 1;
						var cursorProtoForClosure = cursor.prototype;
						superclassObj[keyForClosure] = function superclass_function_wrapper(keyForClosure, depthForClosure, cursorProtoForClosure) {
							return function superclass_function() {
								// increment the depth count on the function
								this.__closureDepths[keyForClosure] = depthForClosure + 1;
								// run the superclass function
								cursorProtoForClosure[keyForClosure].apply(this, arguments);
								// decrement the depth count
								this.__closureDepths[keyForClosure] = depthForClosure;
							}.bind(this);
						}.bind(this)(aKey, depth - 1, cursor.prototype);
					}
				}
			}
			return superclassObj;
		}
		var result = (this.initialize ? this.initialize.apply(this, arguments) : false);
		if (result == AC.Class.Invalidate) {
			var timeoutCallback = function () {
				try {
					if (this && this['_parentClass'] && this['_parentClass']['_sharedInstance'] == this) {
						this['_parentClass']['_sharedInstance'] = null;
					}
				}
				catch (e) {
					throw e;
				}
			}
			setTimeout(timeoutCallback.bind(this), 200);
		}
	}
	ACGeneratedClass.autocreate = inOptInstantiateOnAwakeFromPage;
	ACGeneratedClass.sharedInstance = function () {
		if (!ACGeneratedClass['_sharedInstance']) {
			ACGeneratedClass['_sharedInstance'] = new ACGeneratedClass();
			ACGeneratedClass['_sharedInstance']['_parentClass'] = ACGeneratedClass;
		}
		return ACGeneratedClass['_sharedInstance'];
	}
	ACGeneratedClass.sharedInstanceShortcut = function (inShortcutName) {
		if (!(inShortcutName && inShortcutName.match && inShortcutName.match(/\S/))) {
			throw 'No shortcut name provided.';
		}
		if (AC[inShortcutName]) {
			throw 'Cannot use shortcuts to override existing objects in the AC namespace.';
		}
		AC[inShortcutName] = ACGeneratedClass.sharedInstance;
		return ACGeneratedClass;
	}
	// Create a shared instance of this class on DOM ready.
	if (inOptInstantiateOnAwakeFromPage) {
		AC.onDOMReady(function () {
			if (ACGeneratedClass.autocreate) ACGeneratedClass.sharedInstance();
		});
	}
	return ACGeneratedClass;
};
AC.Class.Subclass = function (superclass, prototypeObjects, inOptInstantiateOnAwakeFromPage) {
	var subclass = this.Class(inOptInstantiateOnAwakeFromPage);
	AC.Object.extend(AC.Object.extend(subclass.prototype, AC.Object.extend(superclass.prototype)), prototypeObjects || {});
	subclass.__superclass = superclass;
	subclass.prototype.__superclass = superclass;
	return subclass;
};
AC.Class.Invalidate = function() {
	return false;
};
AC.namespace('AC.Ajax');
AC.Ajax.getTransport = function() {
	var request = false;
	try {
		request = new XMLHttpRequest();
	}
	catch (e) { // Couln't get standards-based object
		try {
			request = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e) { // Couldn't get newer MS-proprietary ActiveX object
			try {
				request = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e) { // Total XMLHTTP fail
				request = false;
			}
		}
	}
	return request;
};
AC.Ajax.AjaxTracker = AC.Class();
AC.Ajax.AjaxTracker.prototype = {
	_responders: [],
	initialize: function ac_initialize() {
	},
	addResponder: function ac_addResponder(responder) {
		this._responders.push(responder);
	},
	removeResponder: function ac_removeResponder(responder) {
		var n = 0, length = this._responders.length;
		for (n = 0; n < length; n++) {
			if (this._responders[n] == responder) {
				responder = null;
				this._responders.splice(n,1);
				return true;
			}
		}
		return false;
	}
};
AC.Ajax.AjaxRequest = AC.Class();
AC.Ajax.AjaxRequest.prototype = {
	_transport: null,
	_defaultOptions: {method: 'get'},
	_options: null,
	_mimeTypeOverride: null,
	initialize: function ac_initialize(url, options) {
		this._transport = AC.Ajax.getTransport();
		this.setOptions(AC.Object.extend(this.defaultOptions(), options));
		AC.Ajax.AjaxTracker.sharedInstance().addResponder(this);
		this.transport().onreadystatechange = this._handleTransportStateChange.bind(this);
		this.transport().open(this.options().method, url, true);
		this.transport().setRequestHeader('Content-Type', this.options().contentType);
		this.transport().send(null);
	},
	_handleTransportStateChange: function ac__handleTransportStateChange() {
		if (this.transport().readyState == 4) {
			new AC.Ajax.AjaxResponse(this);
		}
	},
	overrideMimeType: function ac_overrideMimeType(overrideMimeTypeValue) {
		this._mimeTypeOverride = overrideMimeTypeValue; 
		if (this.transport().overrideMimeType) { 
			this.transport().overrideMimeType(overrideMimeTypeValue); 
		} 
	}
};
AC.Ajax.AjaxResponse = AC.Class();
AC.Ajax.AjaxResponse.prototype = {
	_request: null,
	_transport: null,
	initialize: function ac_initialize(request) {
		var complete = false,
			transport = request.transport();
		this._transport = transport;
		this._request = request;
		if (transport.readyState == 4) {
			if (transport.status >= 200 && transport.status < 300) {
				request.options().onSuccess ? request.options().onSuccess(this) : AC.Function.emptyFunction();
				complete = true;
			}
		}
		else if (transport.status >= 400 && transport.status < 500) {
			request.options().onFailure ? request.options().onFailure(this) : AC.Function.emptyFunction();
			complete= true;
		}
		else if (transport.status >= 300 && transport.status < 400) {
			//redirect
			complete = true;
		}
		else if (transport.status >= 500 && transport.status < 600) {
			request.options().onError ? request.options().onError(this) : AC.Function.emptyFunction();
			complete= true;
		}
		if (complete === true) {
			request.options().onComplete ? request.options().onComplete(this) : AC.Function.emptyFunction();
			AC.Ajax.AjaxTracker.sharedInstance().removeResponder(request);
		}
	},
	responseText: function ac_responseText() {
		return this._transport.responseText;
	},
	responseXML: function ac_responseXML() {
		return this._transport.responseXML;
	},
	responseJSON: function ac_responseJSON() {
		return JSON.parse ? JSON.parse(this._transport.responseText) : (new Function('return ' + this._transport.responseText)());
	}
};
AC.Ajax.checkURL = function(url, callback) {
	var transport = AC.Ajax.getTransport();
	transport.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			callback();
		}
	};
	transport.open('HEAD', url, true);
	transport.send(null);
};
AC.Ajax.AjaxRequest.prototype._overrideMimeType = null; 
AC.Ajax.AjaxRequest.prototype.overrideMimeType = function(overrideMimeTypeValue) { 
	this._overrideMimeType = overrideMimeTypeValue; 
	if (this.transport.overrideMimeType) { 
		this.transport.overrideMimeType(overrideMimeTypeValue); 
	} 
};
AC.Retina = AC.Class();
AC.Retina.prototype = {
	__defaultOptions: {
		filenameRegex: /(.*)(\.[a-z]{3}($|#.*|\?.*))/i,
		filenameInsert: '_☃x',
		ignoreCheck: /(^http:\/\/movies\.apple\.com\/|\/105\/|\/global(\/ac_media_player)?\/elements\/quicktime\/|_(([2-9]|[1-9][0-9]+)x|nohires)(\.[a-z]{3})($|#.*|\?.*))/i,
		attribute: 'data-hires',
		recursive: true,
		preload: false,
		checkExists: true,
		checkAsRootRelative: true,
		queueSize: 8,
		disableOniOSHandheld: true,
		debug: location.search.indexOf('debugRetina=true') > -1, /// allows setting a URL parameter to enable debug mode
		lowestPriority: 2,
		replacedAttribute: 'data-hires-status'
	},
	initialize: function ac_initialize(options) {
		
		// Setup options
		if (typeof options !== 'object') {
			options = {};
		}
		this.options = AC.Object.extend(AC.Object.clone(this.__defaultOptions), options);
		// Figure out device pixel ratio
		// If the device pixel ratio is !> 1, then there is no point in continuing
		if ((this.options.debug !== true) && ((AC.Retina.iOSHandheld() && this.options.disableOniOSHandheld === true) || (AC.Retina.devicePixelRatio() <= 1))) {
			this.replace = AC.Function.emptyFunction;
			return false;
		}
		// Force run for debug mode.
		if (this.options.debug === true) {
			AC.Retina._devicePixelRatio = 2;
		}
		this._replacedElements = [];
		// Synthesize Member Data
		AC.Object.synthesize(this);
		// Prioritize images on window load
		// (not on DOM ready because we don't want this to affect perceived page load time in the progress bar)
		if (AC.windowHasLoaded) {
			this.__setup();
		} else {
			var setup = this.__setup.bind(this);
			AC.Element.addEventListener(window, 'load', setup);
		}
	},
	__setup: function ac___setup() {
		// Get all relevant elements and prioritize, then queue
		// Replace images with their higher-res counterparts.
		this.replace(document.body);
	},
	__addToQueue: function ac___addToQueue(image) {
		// Lazily create a queue array
		if (typeof this.__queues === 'undefined') {
			this.__queues = [];
		}
		// Can't add to a queue that doesn't exist
		if (this.__queues.length === 0) {
			this.__queues.push([]);
		}
		// Add this image to the last queue.
		this.__queues[this.__queues.length - 1].push(image);
	},
	__potentialElements: function ac___potentialElements(scopeElement, parent) {
		if (typeof scopeElement === 'undefined') {
			scopeElement = document.body;
		} else {
			scopeElement = AC.Element.getElementById(scopeElement);
		}
		// Get elements that we're told should be considered.
		var denotedElements = AC.Array.toArray(scopeElement.querySelectorAll('[' + this.options.attribute + ']'));
		var potentialElements;
		// If the element should be replaced because one of it's parents has the attribute
		var validRecursiveReplace = function (attr) {
			if (typeof parent === 'undefined') {
				return !!AC.Retina.__ancestorHasAttribute(parent, attr);
			} else {
				return parent.getAttribute(attr) !== null || typeof parent.up('[' + attr + ']') !== 'undefined';
			}
		};
		// Search recursively through the denoted elements for children that need
		// to be replaced
		if (this.options.recursive === true) {
			if (scopeElement !== document.body && validRecursiveReplace(this.options.attribute)) {
				denotedElements = denotedElements.concat(scopeElement);
			}
			potentialElements = [];
			var isReplaceable = this.__isReplaceable.bind(this);
			var searchRecursively = function (el) {
				if (isReplaceable(el)) {
					potentialElements.push(el);
				}
				potentialElements = potentialElements.concat(this.__replaceableElementsWithinElement(el));
			}.bind(this);
			denotedElements.forEach(searchRecursively);
		} else {
			potentialElements = denotedElements;
		}
		return potentialElements;
	},
	__isReplaceable: function ac___isReplaceable(el) {
		// Ignored if has attr set to false or one of its parents does.
		if (
			(el.getAttribute(this.options.attribute) === 'false') ||
			(!!AC.Retina.__ancestorHasAttribute(el, this.options.attribute, 'false') && this.options.recursive === true)
		) {
			return false;
		}
		var notAlreadyReplaced = (typeof el.responsiveImageObject === 'undefined');
		// <img> tags
		if (el.tagName.toLowerCase() === 'img') {
			return notAlreadyReplaced;
		// Whitelist imageLink shortcuts, which are dealt with differently
		} else if (AC.Element.hasClassName(el, 'imageLink') && el.tagName.toLowerCase() === 'a') {
			return true;
		// Background images
		} else {
			var bg = AC.Retina.Image.removeCSSURLSyntax(AC.Element.getStyle(el, 'background-image'));
			// Whitelist srcs ending in proper image format
			return (((bg.match(AC.Retina.rasterImageFormatRegex()) !== null) && notAlreadyReplaced));
		}
	},
	__replaceableElementsWithinElement: function ac___replaceableElementsWithinElement(scopeElement) {
		scopeElement = AC.Element.getElementById(scopeElement);
		var self = this;
		var tags = scopeElement.getElementsByTagName('*');
		var replaceableElements = [];
		var i;
		for (i = 0; i< tags.length; i++) {
			if (this.__isReplaceable(tags[i])) {
				replaceableElements.push(tags[i]);
			}
		}
		return replaceableElements;
	},
	__prioritize: function ac___prioritize(potentialElements) {
		var elements = [];
		var forEach = function (el) {
			if (typeof el.responsiveImageObject !== 'undefined') {
				return;
			}
			var img = new AC.Retina.Image(el, this.options);
			// if there is a URL we can change to
			// and it’s not already hi-res
			if (img.hiResSrc() !== null && !img.isHiRes()) {
				// Create the priority array if one doesn’t already exist for this
				// priority level
				if (typeof elements[img.priority()] === 'undefined') {
					elements[img.priority()] = [];
				}
				// Add this img to its priority level
				elements[img.priority()].push(img);
				// Save reference to object on element
				el.responsiveImageObject = img;
			} else {
				if (img.hiResSrc() && img.isHiRes()) {
					img.setStatus('already-hires');
				} else {
					img.setStatus('not-replaceable');
				}
			}
		}.bind(this);
		// Go through the raw images and filter/prioritize them
		potentialElements.forEach(forEach);
		// Fill empty priority levels with empty array
		var i;
		for (i = this.options.lowestPriority; i >= 0; i--) {
			if (typeof elements[i] === 'undefined') {
				elements[i] = [];
			}
		}
		return AC.Array.flatten(elements);
	},
	__replaceQueues: function ac___replaceQueues() {
		// Lazily create a queue array
		if (typeof this.__queues === 'undefined') {
			this.__queues = [];
		}
		if (this.__queues.length > 0 && this.__queues[0].length > 0) {
			// Create a new queue so elements added after this point don't get added
			// to the queue we're replacing. Can't add to the queue we're replacing
			// after we start because it gets inverted.
			this.__queues.push([]);
			// Replace the next queue, then run replace again until there are no more queues
			var callback = this.__replaceQueues.bind(this);
			this.__replaceNextQueue(callback);
		}
	},
	__replaceNextQueue: function ac___replaceNextQueue(callback) {
		var self = this;
		// Reverse our queue so we can pop items off the end
		var queue = self.__queues[0].reverse();
		var log = function () {
			if (self.options.debug === true) {
				AC.log(arguments);
			}
		};
		// Remove the queue that we are replacing from the list of active queues
		self.__queues.splice(0, 1);
		var replaceQueue = function () {
			log('Found ' + queue.length + ' elements to replace.');
			var replaceNextImage = function() {
				//log('Images left to replace: ' + elementStack.length);
				//log('Replacing next image.');
				var image = queue.pop();
				self._replacedElements.push(image);
				// bail if there are no more images to replace
				if (!image) {
					log('No more images to start replacing.');
					// Run the callback only the first time we
					// run out of images to replace
					if (typeof callback === 'function') {
						callback();
					}
					callback = AC.Function.emptyFunction;
					return;
				}
				// Replace the image, then track it as replaced and replace the next
				image.replace(function(lastImageLoaded) {
					log('Replaced image.', image.hiResSrc(), 'status: ' + image.status());
					replaceNextImage();
				});
			}
			// Fire off a queue of replaceNextImage() calls, based on this.options.queueSize.
			for (var i = 0; i < self.options.queueSize; i ++) {
				replaceNextImage();
			}
		};
		// Use a timer to empty the queue after JS goes idle
		window.setTimeout(replaceQueue, 10);
	},
	replace: function ac_replace(scopeElement, parent) {
		var addToQueue = this.__addToQueue.bind(this);
		this.__prioritize(this.__potentialElements(scopeElement, parent)).forEach(addToQueue);
		// Replace images with their higher-res counterparts.
		this.__replaceQueues();
	}
};
AC.Retina.iOSHandheld = function () {
	return (!!navigator.userAgent.match(/AppleWebKit/i) && (!!navigator.userAgent.match(/Mobile/i) && !navigator.userAgent.match(/ipad/i)));
};
//AC.Retina._rasterImageFormatRegex = /(\.jpg($|#.*|\?.*)|\.png($|#.*|\?.*)|\.gif($|#.*|\?.*)|\.svg($|#.*|\?.*))/;
AC.Retina._rasterImageFormatRegex = /(\.jpg($|#.*|\?.*)|\.png($|#.*|\?.*)|\.gif($|#.*|\?.*))/;
AC.Retina.rasterImageFormatRegex = function () {
	return AC.Retina._rasterImageFormatRegex;
};
AC.Retina.devicePixelRatio = function () {
	if (typeof AC.Retina._devicePixelRatio !== 'undefined') {
		return AC.Retina._devicePixelRatio;
	}
	if ('devicePixelRatio' in window && window.devicePixelRatio > 1) {
		return AC.Retina._devicePixelRatio = 2;
	} else {
		return AC.Retina._devicePixelRatio = 1;
	}
};
AC.Retina.__ancestorHasAttribute = function (el, attr, value) {
	var ancestors = AC.Retina.__ancestors(el);
	var i;
	for (i = 0; i < ancestors.length; i++) {
		if (
			(ancestors[i].getAttribute(attr) === value) ||
			(!value && ancestors[i].hasAttribute(attr))
		) {
			return ancestors[i];
		}
	}
	return null;
};
AC.Retina.__ancestors = function (element, property) {
	element = AC.Element.getElementById(element);
	var elements = [];
	while (element = element.parentNode) {
		if (element.nodeType == 1) elements.push(element);
	}
	return elements;
};
AC.Retina.sharedInstance();
AC.Retina.Image = AC.Class();
AC.Retina.Image.prototype = {
	initialize: function ac_initialize(el, options) {
		this._el = el;
		this._tagName = this._el.tagName.toLowerCase();
		this.options = AC.Object.extend(AC.Object.clone(options), AC.Retina.Image.convertParametersToOptions(this.src()));
		this.setStatus('considered');
		AC.Object.synthesize(this);
	},
	setStatus: function ac_setStatus(status) {
		if (typeof status === 'string') {
			this._status = status;
			this._el.setAttribute(this.options.replacedAttribute, status);
		}
	},
	status: function ac_status() {
		return this._el.getAttribute(this.options.replacedAttribute);
	},
	src: function ac_src() {
		if (typeof this._src !== 'undefined') {
			return this._src;
		}
		if (this.isImageLink()) {
			this._src = this._el.getAttribute('href');
		} else if (this._tagName === 'img') {
			this._src = this._el.getAttribute('src');
		} else {
			this._src = AC.Retina.Image.removeCSSURLSyntax(AC.Element.getStyle(this._el, 'background-image'));
			if (this._src === 'none') {
				return this._src = '';
			}
		}
		return this._src;
	},
	isImageLink: function ac_isImageLink() {
		if (typeof this._isImageLink !== 'undefined') {
			return this._isImageLink;
		}
		return this._isImageLink = (AC.Element.hasClassName(this._el, 'imageLink') && this._tagName === 'a');
	},
	hiResSrc: function ac_hiResSrc() {
		if (typeof this._hiResSrc !== 'undefined') {
			return this._hiResSrc;
		}
		var split;
		// If the format for the hires version of this asset is not the same
		// as the lowres, for instance a png getting replaced by an svg, then
		// let's do that replacement now!
		if (typeof this.options.hiresFormat === 'string') {
			split = this.src().match(/^(.*)((\.[a-z]{3})($|#.*|\?.*))/i);
			if (split !== null && split.length > 1) {
				return this._hiResSrc = split[1] + '.' + this.options.hiresFormat + (split[4] || '');
			}
		}
		split = this.src().match(this.options.filenameRegex);
		if (split === null) {
			return this._hiResSrc = null;
		} else {
			return this._hiResSrc = split[1] + this.options.filenameInsert.replace('☃',AC.Retina.devicePixelRatio()) + split[2];
		}
	},
	isHiRes: function ac_isHiRes() {
		if (this._isHiRes === true) {
			return this._isHiRes;
		}
		// If the attribute is on it, it has already been replaced.
		if (this.status() === 'replaced') {
			return this._isHiRes = true;
		}
		var src = this.src();
		// Assume that if the source not one of these formats,
		// then it is already hires
		if (src.match(AC.Retina.rasterImageFormatRegex()) === null) {
			return this._isHiRes = true;
		}
		// If it's passes our custom check option
		if (src.match(this.options.ignoreCheck) !== null) {
			return this._isHiRes = true;
		}
		return this._isHiRes = false;
	},
	priority: function ac_priority() {
		if (typeof this._priority !== 'undefined') {
			return this._priority;
		}
		// Use parent’s priority if this is a recursive element
		if (this.options.recursive && this._el.hasAttribute(this.options.attribute) === false) {
			var parent = AC.Retina.__ancestorHasAttribute(this._el, this.options.attribute);
			if (!!parent) {
				this._priority = parseInt(parent.getAttribute(this.options.attribute));
			} else {
				this._priority = this.options.lowestPriority;
			}
		} else {
			this._priority = parseInt(this._el.getAttribute(this.options.attribute));
		}
		if (isNaN(this._priority) || this._priority > this.options.lowestPriority) {
			this._priority = this.options.lowestPriority;
		} else if (this._priority < 0) {
			this._priority = 0;
		}
		return this._priority;
	},
	replace: function ac_replace(callback) {
		var self = this;
		var recursiveCallback = self.replace.bind(self, callback);
		var hiResSrc = self.hiResSrc();
		var testSrc;
		// Check to make sure the image exists before we use it.
		if (self._exists === false) {
			self.setStatus('404');
			if (typeof callback === 'function') {
				callback(false);
			}
			return;
		}
		
		// Commented out this check since it doesn't work with Developer akamaization, will uncomment and test when new regexp is finished:
		// <rdar://problem/11610227> Code : AC.Retina 2.2 : checkAsRootRelative only works for images on a subdomain of apple.com
		
    // if (self.options.checkExists === true && typeof self._exists === 'undefined') {
    //  if (self.options.checkAsRootRelative === true || (hiResSrc.indexOf(window.location.origin) === 0 || hiResSrc.indexOf('/') === 0)) {
    //    testSrc = (self.options.checkAsRootRelative === true) ? hiResSrc.replace(/^http:\/\/.*\.apple\.com\//,'/') : hiResSrc;
    //    self._exists = false;
    //    return AC.Ajax.checkURL(testSrc, function () {
    //      self._exists = true;
    //      recursiveCallback();
    //    });
    //  }
    // }
    
		// Handle imageLink shortcuts
		if (self.isImageLink()) {
			self._el.setAttribute('href', hiResSrc);
			self.setStatus('replaced');
			if (typeof callback === 'function') {
				callback(true);
			}
		// Handle everything else
		} else {
			// Still have to preload background images to get their dimensions
			if ((self.options.preload === true || self._tagName !== 'img') && self._isPreloaded !== true) {
				return self.preload(recursiveCallback);
			}
			if (self._tagName === 'img') {
				self._el.setAttribute('src', hiResSrc);
				// Status update (for debugging)
				if ((self.options.preload !== true)) {
					self.setStatus('loading');
					AC.Element.addEventListener(self._el, 'load', function (evt) {
						self.setStatus('replaced');
						if (typeof callback === 'function') {
							callback(true);
						}
					});
					AC.Element.addEventListener(self._el, 'error', function (evt) {
						self.setStatus('404');
						// Failsafe
						self._el.setAttribute('src', self.src());
						if (typeof callback === 'function') {
							callback(false);
						}
					});
				}
			} else {
				/// converted to not rely on Prototype
				//self._el.setStyle('background-image:url(' + hiResSrc + ');');
				//self._el.setStyle('background-size:' + (self.width / AC.Retina.devicePixelRatio()) + 'px ' + (self.height / AC.Retina.devicePixelRatio()) + 'px;');
				self._el.style['background-image'] = 'url(' + hiResSrc + ')';
				self._el.style['background-size']  = (self.width / AC.Retina.devicePixelRatio()) + 'px ' + (self.height / AC.Retina.devicePixelRatio()) + 'px';
				self._el.style['backgroundImage'] = 'url(' + hiResSrc + ')';
				self._el.style['backgroundSize']  = (self.width / AC.Retina.devicePixelRatio()) + 'px ' + (self.height / AC.Retina.devicePixelRatio()) + 'px';
				if (typeof callback === 'function') {
					callback(true);
				}
			}
		}
		// We might have create some new properties that need getters/setters
		self.synthesize();
	},
	preload: function ac_preload(callback) {
		// Don't preload multiple times
		if (this._isPreloaded) {
			return true;
		}
		this.setStatus('loading');
		/// converted to not rely on Prototype
		//var img = new Element('img');
		var img = document.createElement('img');
		AC.Element.addEventListener(img, 'load', function () {
			this._isPreloaded = true;
			// Get image dimensions
			this.width = img.width;
			this.height = img.height;
			this.setStatus('replaced');
			if (typeof callback === 'function') {
				callback();
			}
		}.bind(this));
		AC.Element.addEventListener(img, 'error', function () {
			this.setStatus('404');
			this._exists = false;
			if (typeof callback === 'function') {
				callback();
			}
		}.bind(this));
		img.src = this.hiResSrc();
	}
};
AC.Retina.Image.removeCSSURLSyntax = function (string) {
	if (typeof string === 'string' && typeof string.replace === 'function') {
		//Allow background image URLs to be encapsulated in quotes (to support developer preferences)
		string = string.replace('"','').replace('"','');
		return string.replace(/^url\(/,'').replace(/\)$/,'');
	}
	return '';
};
AC.Retina.Image.convertParametersToOptions = function (string) {
	if (typeof string === 'string' && typeof string.toQueryParams === 'function') {
		var options = string.toQueryParams(), option;
		for (option in options) {
			if (options.hasOwnProperty(option)) {
				options[option.camelize()] = options[option];
			}
		}
		return options;
	}
	return {};
};
