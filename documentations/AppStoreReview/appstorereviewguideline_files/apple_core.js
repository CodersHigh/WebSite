// = Apple.com **Apple Core** =
// TODO load dependencies: browserdetect

if (typeof(AC) == "undefined"){ AC = {}; }

// == **onDOMReady** ==
// Event Extension
//
// http://clientside.cnet.com/code-snippets/event-scripting/a-dom-ready-extension-for-prototype/
Object.extend(Event, {
	_domReady: function () {
		if (arguments.callee.done) return;
		arguments.callee.done = true;

		if (this._timer) clearInterval(this._timer);
		AC.isDomReady = true;
		if (this._readyCallbacks) this._readyCallbacks.each(function (f) {
			f()
		});
		this._readyCallbacks = null;
	},

	onDOMReady: function (f) {
		if (AC.isDomReady) {
			f();
		}
		else {
			if (!this._readyCallbacks) {
				var domReady = this._domReady.bind(this);

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

				Event.observe(window, 'load', domReady);
				Event._readyCallbacks = [];
			}
			Event._readyCallbacks.push(f);
		}
	}
});

// == **AC.decorateSearchInput** ==
AC.decorateSearchInput = function (field, options) {

	var searchField = $(field);
	var standIn = null;

	var results = 0;
	var placeholder = '';
	var autosave = '';

	if (options) {

		if (options.results) {
			results = options.results;
		}
		if (options.placeholder) {
			placeholder = options.placeholder;
		}
		if (options.autosave) {
			autosave = options.autosave;
		}

	}

	if (AC.Detector.isWebKit() && !AC.Detector.isChrome()) {

		if (AC.Detector.isWin()) {
			searchField.addClassName('not-round');
		}

		searchField.setAttribute('type', 'search');
		if (!searchField.getAttribute('results')) {
			searchField.setAttribute('results', results);
		}

		if (null != placeholder) {
			searchField.setAttribute('placeholder', placeholder);
			searchField.setAttribute('autosave', autosave);
		}

	} else {

		//prevent browser from doing its own autocomplete, threw odd xul 
		//error on reset sometimes, although this feels a little
		//heavy handed
		searchField.setAttribute('autocomplete', 'off');

		//replace the field with a standin while we create the wrapper
		//we can't lose the reference to this field as other objects may
		//have already registered listeners on this field
		standIn = document.createElement('input');
		searchField.parentNode.replaceChild(standIn, searchField)

		var left = document.createElement('span');
		Element.addClassName(left, 'left');

		var right = document.createElement('span');
		Element.addClassName(right, 'right');

		var reset = document.createElement('div');
		Element.addClassName(reset, 'reset');

		var wrapper = document.createElement('div');
		Element.addClassName(wrapper, 'search-wrapper');
		wrapper.setAttribute('data-hires', 'true');

		var alreadyHasPlaceholder = field.value == placeholder;
		var isEmpty = field.value.length == 0;

		if (alreadyHasPlaceholder || isEmpty) {
			searchField.value = placeholder;
			Element.addClassName(wrapper, 'blurred');
			Element.addClassName(wrapper, 'empty');
		}

		wrapper.appendChild(left);
		wrapper.appendChild(searchField);
		wrapper.appendChild(right);
		wrapper.appendChild(reset);

		var focus = function () {

			var blurred = Element.hasClassName(wrapper, 'blurred');

			//need to check for flag AND placeholder lest somebody need to 
			//search for the placeholder text itself
			if (searchField.value == placeholder && blurred) {
				searchField.value = '';
			}

			Element.removeClassName(wrapper, 'blurred');
		}
		Event.observe(searchField, 'focus', focus);

		var blur = function () {

			if (searchField.value == '') {
				Element.addClassName(wrapper, 'empty');
				searchField.value = placeholder;
			}

			Element.addClassName(wrapper, 'blurred');
		}
		Event.observe(searchField, 'blur', blur);


		var toggleReset = function () {

			if (searchField.value.length >= 0) {
				Element.removeClassName(wrapper, 'empty');
			}
		}
		Event.observe(searchField, 'keydown', toggleReset);


		var resetField = function () {
			return (function (evt) {

				var escaped = false;

				if (evt.type == 'keydown') {
					if (evt.keyCode != 27) {
						return; //if it's not escape ignore it
					} else {
						escaped = true;
					}
				}

				searchField.blur(); //can't change value while in field
				searchField.value = '';
				Element.addClassName(wrapper, 'empty');
				searchField.focus();

			})
		}
		Event.observe(reset, 'mousedown', resetField());
		Event.observe(searchField, 'keydown', resetField());

		if (standIn) {
			standIn.parentNode.replaceChild(wrapper, standIn);
		}

	}
}


// == **New Element Methods** ==
//
// Extending prototype's element methods with some custom ones
//
Element.addMethods({

	// ** {{{ Element.getInnerDimensions(element) }}} **
	//
	getInnerDimensions: function (element) {

		element = $(element);
		var d = Element.getDimensions(element);

		var innerHeight = d.height;
		var styleOf = Element.getStyle;
		innerHeight -= styleOf(element, 'border-top-width') && styleOf(element, 'border-top-width') != 'medium' ? parseInt(styleOf(element, 'border-top-width'), 10) : 0;
		innerHeight -= styleOf(element, 'border-bottom-width') && styleOf(element, 'border-bottom-width') != 'medium' ? parseInt(styleOf(element, 'border-bottom-width'), 10) : 0;
		innerHeight -= styleOf(element, 'padding-top') ? parseInt(styleOf(element, 'padding-top'), 10) : 0;
		innerHeight -= styleOf(element, 'padding-bottom') ? parseInt(styleOf(element, 'padding-bottom'), 10) : 0;

		var innerWidth = d.width;
		innerWidth -= styleOf(element, 'border-left-width') && styleOf(element, 'border-left-width') != 'medium' ? parseInt(styleOf(element, 'border-left-width'), 10) : 0;
		innerWidth -= styleOf(element, 'border-right-width') && styleOf(element, 'border-right-width') != 'medium' ? parseInt(styleOf(element, 'border-right-width'), 10) : 0;
		innerWidth -= styleOf(element, 'padding-left') ? parseInt(styleOf(element, 'padding-left'), 10) : 0;
		innerWidth -= styleOf(element, 'padding-right') ? parseInt(styleOf(element, 'padding-right'), 10) : 0;

		return {
			width: innerWidth,
			height: innerHeight
		};
	},


	// ** {{{ Element.getOuterDimensions(element) }}} **
	//
	// Yes, we understand this is a hack. Safari is calculating margins for unpositioned elements
	// as the total remaining viewport width.
	//
	getOuterDimensions: function (element) {
		element = $(element);
		var clone = element.cloneNode(true);

		var parent = (element.parentNode) ? element.parentNode : document.body;
		parent.appendChild(clone);

		Element.setStyle(clone, {
			position: "absolute",
			visibility: "hidden"
		});
		var d = Element.getDimensions(clone);

		var outerHeight = d.height;
		var styleOf = Element.getStyle;
		outerHeight += styleOf(clone, 'margin-top') ? parseInt(styleOf(clone, 'margin-top'), 10) : 0;
		outerHeight += styleOf(clone, 'margin-bottom') ? parseInt(styleOf(clone, 'margin-bottom'), 10) : 0;

		var outerWidth = d.width;
		outerWidth += styleOf(clone, 'margin-left') ? parseInt(styleOf(clone, 'margin-left'), 10) : 0;
		outerWidth += styleOf(clone, 'margin-right') ? parseInt(styleOf(clone, 'margin-right'), 10) : 0;

		Element.remove(clone);

		return {
			width: outerWidth,
			height: outerHeight
		};
	},


	// ** {{{ Element.translateOffset(element) }}} **
	//
	// Return x, y, and z translate offsets if applicable.
	// Assumes units are in pixels.
	// Non-vendor specific.
	//
	translateOffset: function(element) {
		var transform, translate, offset = null;

		// Get the vendor-specific transform if the agnostic one does not exist
		transform = element.getStyle('transform');
		if (!transform) {
			transform = element.getStyle('webkitTransform');
		}
		if (!transform) {
			transform = element.getStyle('MozTransform');
		}
		if (!transform) {
			transform = element.getStyle('msTransform');
		}
		if (!transform) {
			transform = element.getStyle('oTransform');
		}

		// If there is any sort of a transform
		if (transform) {
			// Get the translate function from the string
			translate = transform.match(/.*(translate|translate3d|translateZ|translateX|translateY)\(([^)]+).*/);

			if (translate) {
				offset = [];

				// Parse the regex results from the translate string
				switch (translate[1]) {
					case "translateX":
						offset[0] = parseInt(translate[2]);
						offset[1] = 0;

						break;
					case "translateY":
						offset[1] = parseInt(translate[2]);
						offset[0] = 0;

						break;
					case "translateZ":
						offset[2] = parseInt(translate[2]);
						offset[0] = 0;
						offset[1] = 0;
						
						break;
					default:
						offset = translate[2].split(/,\s*/);

						if (typeof offset[0] !== "undefined") {
							offset[0] = parseInt(offset[0]);
						}
						if (typeof offset[1] !== "undefined") {
							offset[1] = parseInt(offset[1]);
						}
						if (typeof offset[2] !== "undefined") {
							offset[2] = parseInt(offset[2]);
						}

						break;
				}

				// Save values in a hash to make things simpler, consistent with Prototype
				offset.type = translate[1];
				offset.x = offset[0];
				offset.y = offset[1];
				offset.z = offset[2];
			} else {
				// If we don't have a translate, maybe we have a matrix?
				translate = transform.match(/.*(matrix)\(([^)]+).*/);

				if (translate !== null) {
					translate = transform.match(/.*(matrix)\(([^)]+).*/)[2].split(', ');
					offset = [parseFloat(translate[4]), parseFloat(translate[5])];

					// We can't know if the translate is 3d or not based on a matrix
					offset.type = 'matrix';
					offset.x = offset[0];
					offset.y = offset[1];
					offset.z = null;
				}
			}
		}

		return offset;
	},


	// ** {{{ Element.removeAllChildNodes(element) }}} **
	//
	removeAllChildNodes: function (element) {
		element = $(element);
		if (!element) {
			return;
		}

		while (element.hasChildNodes()) {
			element.removeChild(element.lastChild);
		}
	},

	// ** {{{ Element.setVendorPrefixStyle(element, property, value) }}} **
	//
	// Sets all the vendor specific style {{{property}}} to {{{value}}} on {{{element}}}.
	//
	// {{{element}}}: the element for which to set the style upon
	// {{{property}}}: the css property, e.g. borderRadius, webkitBorderRadius, border-radius, etc...
	// {{{value}}}: the value for which to set the element's css property
	//
	setVendorPrefixStyle: function (element, property, value) {
		if (property.match(/^webkit/i)) {
			property = property.replace(/^webkit/i, '');
		} else if (property.match(/^moz/i)) {
			property = property.replace(/^moz/i, '');
		} else if (property.match(/^ms/i)) {
			property = property.replace(/^ms/i, '');
		} else if (property.match(/^o/i)) {
			property = property.replace(/^o/i, '');
		} else if (property.match('-')) {
			var properties = property.split('-'),
			    length = properties.length;
			property = '';
			for (var i = 0; i < properties.length; i++) {
				property += properties[i].charAt(0).toUpperCase() + properties[i].slice(1);
			}
		} else {
			property = property.charAt(0).toUpperCase() + property.slice(1);
		}

		if (value.match('-webkit-')) {
			value = value.replace('-webkit-', '-vendor-');
		} else if (value.match('-moz-')) {
			value = value.replace('-moz-', '-vendor-');
		} else if (value.match('-ms-')) {
			value = value.replace('-ms-', '-vendor-');
		} else if (value.match('-o-')) {
			value = value.replace('-o-', '-vendor-');
		}

		element.style['webkit' + property] = value.replace('-vendor-', '-webkit-');
		element.style['Moz' + property] = value.replace('-vendor-', '-moz-'); // FireFox expects capitalized M
		element.style['ms' + property] = value.replace('-vendor-', '-ms-');
		element.style['O' + property] = value.replace('-vendor-', '-o-');

		// apply generic property as camelCase and CamelCase
		element.style[property] = value;
		property = property.charAt(0).toLowerCase() + property.slice(1);
		element.style[property] = value;
	},


	// ** {{{ Element.setVendorPrefixTransform(element, x, y) }}} **
	//
	// Determines which vendor specific prefix is appropriate and adds 2d transform {{{x}}}-value and {{{y}}}-value on {{{element}}}.
	// In addition, the string {{{'none'}}} can be passed as the {{{x}}}-value argument to set the transform property to none.
	setVendorPrefixTransform: function(element, x, y) {
		if (x == 'none') {
			element.setVendorPrefixStyle('transform', 'none');
			return;
		}

		if (x == null) {
			x = 0;
		}
		if (y == null) {
			y = 0;
		}

		if (AC.Detector.supportsThreeD()) {
			element.setVendorPrefixStyle('transform', 'translate3d('+x+', '+y+', 0)');
		} else {
			element.setVendorPrefixStyle('transform', 'translate('+x+', '+y+')');
		}
	},


	// ** {{{ Element.addVendorEventListener(element, type, listener, useCapture) }}} **
	//
	// Sets all the vendor event {{{listener}}}s of {{{type}}} on {{{element}}}.
	//
	// {{{element}}}: the element for which to set the listener upon
	// {{{type}}}: a string representing the event type to listen for, e.g. animationEnd, webkitAnimationEnd, etc...
	//			   IMPORTANT: This value is expected to be a string in camelCase.
	// {{{listener}}}: the object that receives a notification when an event of the specified type occurs.
	// {{{useCapture}}}: If true, useCapture indicates that the user wishes to initiate capture.
	//
	addVendorEventListener: function (element, type, listener, useCapture) {
		if (typeof(addEventListener) == 'function') {
			if (type.match(/^webkit/i)) {
				type = type.replace(/^webkit/i, '');
			} else if (type.match(/^moz/i)) {
				type = type.replace(/^moz/i, '');
			} else if (type.match(/^ms/i)) {
				type = type.replace(/^ms/i, '');
			} else if (type.match(/^o/i)) {
				type = type.replace(/^o/i, '');
			} else {
				type = type.charAt(0).toUpperCase() + type.slice(1);
			}

			// To avoid adding the same event twice, we need to sniff the user agent.
			// Once we've confirmed a browser supports the generic event name, we'll
			// change this if to be < that build.
			if (/WebKit/i.test(navigator.userAgent)) {
				element.addEventListener('webkit'+type, listener, useCapture);
			} else if (/Opera/i.test(navigator.userAgent)) {
				element.addEventListener('O'+type, listener, useCapture);
			} else if (/Gecko/i.test(navigator.userAgent)) {
				element.addEventListener(type.toLowerCase(), listener, useCapture);
			} else {
				type = type.charAt(0).toLowerCase() + type.slice(1);
				return element.addEventListener(type, listener, useCapture);
			}
		}
	},

	// ** {{{ Element.removeVendorEventListener(element, type, listener, useCapture) }}} **
	//
	// Removes all the vendor event {{{listener}}}s of {{{type}}} on {{{element}}}.
	//
	// {{{element}}}: the element for which to remove the listener from
	// {{{type}}}: a string representing the event type to listen for, e.g. animationEnd, webkitAnimationEnd, etc...
	//			   IMPORTANT: This value is expected to be a string in camelCase.
	// {{{listener}}}: the object that receives a notification when an event of the specified type occurs.
	// {{{useCapture}}}: If true, useCapture indicates that the user wishes to initiate capture.
	//
	removeVendorEventListener: function (element, type, listener, useCapture) {
		if (typeof(removeEventListener) == 'function') {
			if (type.match(/^webkit/i)) {
				type = type.replace(/^webkit/i, '');
			} else if (type.match(/^moz/i)) {
				type = type.replace(/^moz/i, '');
			} else if (type.match(/^ms/i)) {
				type = type.replace(/^ms/i, '');
			} else if (type.match(/^o/i)) {
				type = type.replace(/^o/i, '');
			} else {
				type = type.charAt(0).toUpperCase() + type.slice(1);
			}

			element.removeEventListener('webkit' + type, listener, useCapture);
			element.removeEventListener('O' + type, listener, useCapture);
			element.removeEventListener(type.toLowerCase(), listener, useCapture);

			type = type.charAt(0).toLowerCase() + type.slice(1);
			return element.removeEventListener(type, listener, useCapture);
		}
	}
});

// ** {{{ Rigging up window vendor event listeners as well }}} **
//
window.addVendorEventListener = function (type, listener, useCapture) {
	Element.Methods.addVendorEventListener(window, type, listener, useCapture);
};
window.removeVendorEventListener = function (type, listener, useCapture) {
	Element.Methods.removeVendorEventListener(window, type, listener, useCapture);
};

// ** {{{ Element.childNodeWithNodeTypeAtIndex(element, nodeType, index) }}} **
//
Element.Methods.childNodeWithNodeTypeAtIndex = function (element, nodeType, index) {
	var node = element.firstChild;
	if (!node) return null;
	var i = 0;
	while (node) {
		if (node.nodeType === nodeType) {
			if (index === i) {
				return node;
			}
			i++;
		}
		node = node.nextSibling;
	}
	return null;
};


// == Element2 ==
//
// Legacy Element2 for old extended element methods. Used in AC.Media
//
var Element2 = {};
Element2.Methods = Object.clone(Element.Methods);


// == ** Omniture Tracking library ** ==
//
if (typeof(AC.Tracking) == "undefined") {
	AC.Tracking = {};
}

// ** {{{ AC.Tracking.getLinkClicked(target) }}} **
//
AC.Tracking.getLinkClicked = function (target) {
	if (!target) {
		return null;
	}

	while (target.nodeName.toLowerCase() != 'a' && target.nodeName.toLowerCase() != 'body') {
		target = target.parentNode;
	}

	if (!target.href) {
		target = null;
	}

	return target;
}

// ** {{{ AC.Tracking.trackLinksWithin(container, test, title, properties, options) }}} **
//
AC.Tracking.trackLinksWithin = function (container, test, title, properties, options) {
	$(container).observe('mousedown', function (evt) {

		var target = AC.Tracking.getLinkClicked(Event.element(evt));

		if (target && test(target)) {

			if (options && options.beforeTrack) {
				// provides a way to alter the properties or the title in some way for the mousedown
				// most felixble way to capture what link was actually clicked or whatever else
				// you want at the time of the event
				var altered = options.beforeTrack(target, title, properties);
				if (altered) {
					title = altered.title;
					properties = altered.properties;
				}
			}

			AC.Tracking.trackClick(properties, this, 'o', title);
		}

	});
}

// ** {{{ AC.Tracking.tagLinksWithin(container, key, value, test) }}} **
//
// Effectively tags all links within a container conforming to the supplied 
// test function reference with the specified key and value.
//
// The test argument should be a function reference expecting the link as 
// its first and only parameter. It should simply return true or false 
// indicating whether the link should be tagged or not.
//
AC.Tracking.tagLinksWithin = function (container, key, value, test) {
	$(container).observe('mousedown', function (evt) {

		var link = Event.element(evt);

		if (!link) {
			return;
		}

		while (link.nodeName.toLowerCase() != 'a' && link.nodeName.toLowerCase() != 'body') {
			link = link.parentNode;
		}

		if (link.href && test(link)) {
			AC.Tracking.tagLink(link, key, value);
		}

		link = null;
	})
}

// ** {{{ AC.Tracking.tagLink(link, key, value) }}} **
//
// Appends the specified key and value to the querystring of the supplied 
// anchor's href attribute.
//
AC.Tracking.tagLink = function (link, key, value) {
	var href = link.getAttribute('href');

	if (href.match(/\?/)) {
		var params = href.toQueryParams();
		params[key] = value;
		href = href.split(/\?/)[0] + '?' + $H(params).toQueryString();
	} else {
		href += '?' + key + '=' + value;
	}

	link.setAttribute('href', href);
}

// ** {{{ AC.Tracking.s_vi() }}} **
//
AC.Tracking.s_vi = function () {
	var cookies = document.cookie.split(';'),
		s_vi = null,
		match;

	for (var i = 0, cookie;
	(cookie = cookies[i]); i++) {
		match = cookie.match(/^\s*s_vi=\[CS\]v1\|(.+)\[CE\]\s*$/);
		if (match) {
			s_vi = match[1];
			break;
		}
	}

	return s_vi;
}

// ** {{{ AC.Tracking.track(trackingMethod, properties, options) }}} **
//
// Makes a tracking request.
//
// //Note:// Typically you won't need to call this directly, instead you should
// track events using either TrackClick or TrackPage, which provide more
// friendly interfaces to this method.
//
// * {{{trackingMethod}}} the method of Omniture tracking to use
//
// * {{{properties}}} associative array of property names and their associated values to track
//
// * {{{options}}} associate array of options to use in this tracking context, 
// 	some of these are required depending upon the trackingMethod you have chose
//
AC.Tracking.track = function (trackingMethod, properties, options) {
	if (typeof(s_gi) == 'undefined' || !s_gi) {
		return;
	}

	options = options || {};

	//use existing tracking account if available, or use one from the options
	if (typeof(s_account) != 'undefined') {
		s = s_gi(s_account)
	} else if (options.s_account) {
		s = s_gi(options.s_account);
	} else {
		return;
	}

	if (trackingMethod == s.tl) {

		var linkTrackVars = ''

		for (var key in properties) {
			linkTrackVars += key + ',';
		}
		linkTrackVars = linkTrackVars.replace(/,$/, '');

		s.linkTrackVars = linkTrackVars;
	} else {
		s.linkTrackVars = '';
	}

	//clear properties set by default within a page
	s.prop4 = "";
	s.g_prop4 = "";
	s.prop6 = "";
	s.g_prop6 = "";
	s.pageURL = "";
	s.g_pageURL = "";
	s.g_channel = "";

	var sanitize = function (value) {
		if (typeof(value) == "string") {
			return value.replace(/[\'\"\ì\î\ë\í]/g, '');
		} else {
			return value;
		}
	}

	for (var key in properties) {

		s[key] = sanitize(properties[key]);

		if (key == 'events') {
			s.linkTrackEvents = sanitize(properties[key]);
		}
	}

	if (trackingMethod == s.t) {
		void(s.t());
	} else {
		s.tl(options.obj, options.linkType, sanitize(options.title));
	}

	for (var key in properties) {
		if (key != 'pageName') {
			s[key] = '';
		}
		if (key == 'events') {
			s.linkTrackEvents = 'None';
		}
	}

},

// ** {{{ AC.Tracking.track(trackingMethod, properties, options) }}} **
//
// Uses the Omniture s.tl Tracking method to track a "click"
// 
// * {{{properties}}} associative array of params and associated values
// 
// * {{{obj}}} object for context, usually "this"
// 
// * {{{linkType}}} type of link for Omniture usually 'o'
// 
// * {{{title}}} human readable title for this link that shows up in reports
// 
// * {{{options}}} associative array of options to apply to this tracking context (currently no valid options are available)
//
AC.Tracking.trackClick = function (properties, obj, linkType, title, options) {
	var options = {
		obj: obj,
		linkType: linkType,
		title: title
	};

	AC.Tracking.track(s.tl, properties, options);
},

// ** {{{ AC.Tracking.track(trackingMethod, properties, options) }}} **
//
// Uses the Omniture s.t Tracking method to track a "page load"
//
// * {{{properties}}} associative array of params and associated values
//
// * {{{options}}} associative array of options to apply to this tracking context
//
AC.Tracking.trackPage = function (properties, options) {
	AC.Tracking.track(s.t, properties, options);
}


// == **New String Methods** ==
//
// Extending prototype's string methods with some custom ones
//

// ** {{{ String.lastPathComponent() }}} **
//
String.prototype.lastPathComponent = function () {
	var index = this.lastIndexOf("/");
	if (index != -1) {
		return this.substring(index + 1, this.length - 1);
	}
	else return null;
}

// ** {{{ String.stringByDeletingLastPathComponent() }}} **
//
String.prototype.stringByDeletingLastPathComponent = function () {
	var index = this.lastIndexOf("/");
	if (index != -1) {
		return this.slice(0, index);
	}
	else return null;
}

// ** {{{ String.stringByAppendingPathComponent(value) }}} **
//
String.prototype.stringByAppendingPathComponent = function (value) {
	return (this.lastIndexOf("/") !== (this.length - 1)) ? (this + "/" + value) : (this + value);
}

// ** {{{ String.stringByRemovingPrefix(value) }}} **
//
String.prototype.stringByRemovingPrefix = function (value) {
	var index = this.indexOf(value);
	if (index > -1) {
		var result = this.substring(index + value.length, this.length);
		return result;
	}
	else {
		return this;
	}
}

// ** {{{ String.pathExtension() }}} **
//
String.prototype.pathExtension = function () {
	var lastPathComponent = this.lastPathComponent();
	var index = lastPathComponent.lastIndexOf(".");
	if (index != -1) {
		return lastPathComponent.slice(index, lastPathComponent.length);
	}
	else return "";
}


// == **New Array Methods** ==
//
// Extending prototype's array methods with some custom ones
//

// ** {{{ Array.addObjectsFromArray(array) }}} **
//
Array.prototype.addObjectsFromArray = function (array) {
	if (array.constructor === Array) {
		this.push.apply(this, array);
	}
	else {
		for (var i = 0, item;
		(item = array[i]); i++) {
			this[this.length] = item;
		}
	}
}

// ** {{{ Array.item(index) }}} **
//
Array.prototype.item = function (index) {
	return this[index];
}


// == document._importNode ==
//
document._importNode = function (node, allChildren) {
	/* find the node type to import */
	if (node.nodeType === Node.ELEMENT_NODE) {
		/* create a new element */
		var newNode = document.createElement(node.nodeName);
		var i, il;
		/* does the node have any attributes to add? */
		if (node.attributes && node.attributes.length > 0)
		/* add all of the attributes */
		var nodeAttributes = node.attributes;
		var iNodeName, iNodeValue;
		for (i = 0, il = node.attributes.length; i < il;) {
			iNodeName = nodeAttributes[i].nodeName;
			iNodeValue = node.getAttribute(nodeAttributes[i++].nodeName);
			if (iNodeName === "class") {
				//iNodeName = "className";
				newNode.setAttribute("className", iNodeValue);
			}
			newNode.setAttribute(iNodeName, iNodeValue);
		}
		/* are we going after children too, and does the node have any? */
		if (allChildren && node.childNodes && node.childNodes.length > 0) {
			/* recursively get all of the child nodes */
			for (i = 0, il = node.childNodes.length; i < il; i++) {
				//NOSCRIPT doesn't support the appendChild of even a text node, so we'll skip it
				if (newNode.tagName === "NOSCRIPT") {
					continue;
				}
				newNode.appendChild(document._importNode(node.childNodes[i], allChildren));
			}
		}
		return newNode;
	}
	else if (node.nodeType === Node.TEXT_NODE) {
		return document.createTextNode(node.nodeValue);
	}
	else if (node.nodeType === Node.COMMENT_NODE) {
		return document.createComment(node.nodeValue);
	}
	else if (node.nodeType === Node.CDATA_SECTION_NODE) {
		return document.createCDATASection(node.nodeValue);
	}
	else return null;
};
if (!document.importNode) { document.importNode = document._importNode; }

// == Random, IE Fixes ==
//
if(typeof document.head == 'undefined'){ document.head = document.getElementsByTagName('head')[0]; }
if (AC.Detector.isIEStrict()) {

	Element.Methods.hasAttribute = function (element, attributeName) {
		if (attributeName == "class") attributeName = "className";
		else if (attributeName == "for") attributeName = "htmlFor";
		var result = element.getAttribute(attributeName);
		return ((result != null) && (result !== ""));

	};

	document._getElementsByName = document.getElementsByName;
	document._HTMLElementsWithName = ["a", "apple", "button", "form", "frame", "iframe", "img", "input", "object", "map", "meta", "param", "textarea", "select"];

	document.getElementsByName = function (name) {
		var _HTMLElementsWithName = this._HTMLElementsWithName;
		var result = [],
			ieResult, i, iNode;
		for (var e = 0, element;
		(element = _HTMLElementsWithName[e]); e++) {
			ieResult = document.getElementsByTagName(element);
			for (i = 0;
			(iNode = ieResult[i]); i++) {
				if (iNode.name === name) {
					result[result.length] = iNode;
				}
			}
		}

		return result;
	}
}


// == JSON ==
// Fallback (for IE) to have JSON.stringify and JSON.parse methods
//
// From: https://github.com/douglascrockford/JSON-js/blob/master/json2.js
//
/*********************** JSON ***********************/
if(typeof JSON == "undefined" || !('stringify' in JSON && 'parse' in JSON)){if(!this.JSON){this.JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());}
/*********************** JSON ***********************/



// == HTML5 Activation for Older Browsers ==
["abbr","article","aside","command","details","figcaption","figure","footer","header","hgroup","mark","meter","nav","output","progress","section","summary","time"].each(function(n){
	document.createElement(n);
});



// = **AC.Storage** =
//
// //@ author:// Kyle Olson
//
// Allows for safe use of HTML5 localStorage, without worrying about errors that come
// from user privacy settings or older browsers. There is also a new expiration functionality
// to avoid from users retaining localStorage values indefinitely and filling up our quotas.
//
// Also has integration for sessionStorage, by setting the //days// attribute to //0//
// using the setItem method.
//
// Read more about HTML5 localStorage:
// http://developer.apple.com/library/safari/#documentation/iPhone/Conceptual/SafariJSDatabaseGuide/Name-ValueStorage/Name-ValueStorage.html
//
// Has optional degredatation strategies for older browsers, including #userData support
// (mimicking localStorage) for IE6/IE7, and cookies.
//
// Internet Explorer 6 & 7 use the #userData behavior. #userData allows us
// to store localStorage data as attributes on elements, then record those attributes persistently.
// It also has native expiration functionality. The expirience for the user should be the same
// as if they had a browser that supported localStorage.
// Read more about #userData here: http://msdn.microsoft.com/en-us/library/ms531424(v=vs.85).aspx
//
// *NOTE* #userData items can only be accessed from the page they were saved on. localStorage, sessionStorage, and cookie items
// can be accessed from any other page on the same domain name, or sub-domain if applicable. E.g. you cannot access values from
// www.apple.com on support.apple.com.
//
// Automatically degrading to cookies is disabled by default, but even with that disabled,
// you can access the cookies getter/setter methods through the {{{AC.Storage.cookie}}} object.

//
// == MetaData ==
//
// AC.Storage, unlike localStorage, saves metadata along with the key/value pair. The default
// data to store is an expiration date, but any other properties can be stored as well through
// the metadata attribute in the {{{AC.Storage.setItem}}} method.
//
// This is accomplished by creating a JavaScript object that contains the value and meta data,
// then converting that object to a JSON string for saving it out. This data gets parsed back
// into an object with the getter methods, then the value is returns directly.
//
// In staying consistent with the localStorage and sessionStorage functionality, the {{{AC.Storage.getItem}}}
// method only returns the value itself. If you want to access any of the metadata associated
// with an item, you will want to use the {{{AC.Storage.getItemObject}}} method, which returns by
// default the value as //obj.value// and the expiration date as //obj.expires//.
//
// **NOTE:** MetaData cannot be stored using cookies, but it is stored with #userData and sessionStorage.

//
// == Saving JavaScript Objects ==
//
// By adding metadata to keep track of expiration date, we get the ability to save simple javascript object literals
// for free. You can pass an object literal to the {{{AC.Storage.setItem}}} method and it will store it as a JSON string.
// Objects can be infinitely nested, but not all types are supported. Any supported types can be nested as well, for instance
// you can put dates in arrays.
//
// === Supported JavaScript Object Types ===
//
// *{{{Object Literal}}}: e.g. //{ key: 'value' }//
//
// *{{{String}}}: e.g. //"I'm a string"//
//
// *{{{Numbers}}}: e.g. //100// or //3.14//
//
// *{{{Dates}}}: e.g. //new Date()//
//
// *{{{Arrays}}}: e.g. //['first object','second object']//

//
// == Private Browsing Modes ==
//
// *{{{Private Browsing in Safari}}}: Private Browsing completely disables localStorage for Safari. You will not
// be able to store any items unless you allow cookies. Using localStorage.getItem, you can still retrieve localStorage
// items in private browsing mode (as JSON strings), but AC.Storage will return null for any items.
//
// *{{{Private Browsing in FireFox}}}: Firefox treats all localStorage items as sessionStorage when in private browsing mode.
// Also, you do not have access to any localStorage values stored in normal browsing mode until the user exits private browsing.
//
// *{{{Cookies Disabled}}}: Browsers treat disabling cookies as disabling localStorage as well. AC.Storage will //most likely// not
// work when cookies are disabled. But you will not receive errors when trying to access AC.Storage when cookies are disabled.
//

//
// == Cleanup ==
//
// === Expiration ===
//
// *{{{localStorage}}}: There is no native expiration functionality for localStorage, so AC.Storage
// accomplishes this by storing metadata associated with the key/value pairs
//
// *{{{sessionStorage}}}: We use the native sessionStorage expiration functionality, which is until the user ends
// the session by closing the browser window.
//
// *{{{#userData}}}: We use the same expiration functionality that we implemented for localStorage, which is not native.
//
// *{{{cookies}}}: Native cookie expiration.
//
// === Removing Expired localStorage items ===
//
// Since localStorage does not have any native expiration functionality, we need to be in charge
// of removing expired items. This can happen two ways using AC.Storage.
//
// *{{{getItem}}}: Any time you call the {{{AC.Storage.getItem}}} method, it will check to see
// if the item has expired before returning it. If it has expired, it returns null and removes
// the item.
//
// *{{{removeExpired}}}: The {{{AC.Storage.removeExpired}}} method is never run internally in AC.Storage,
// but should be run every once in a while to clear out all expired items on the user's machine. I've placed
// a call to this method in the promomanager.js script, which is often located on high level pages. This should
// ensure that people don't build up large stockpiles of expired items.
// 
// *NOTE* #userData is on a per-page basis, not a per-domain basis, which means the expiration functionality will not
// work for browsers using #userData unless the check runs on the page that set the item.

AC.Storage = {
	// == Options ==
	//
	// *{{{allowCookies}}} [**false**]: (boolean) Use cookies as a fallback for browsers without localStorage support.
	// NOTE: Cookies are unable to store anything but numbers and strings through AC.Storage, meaning metadata and values
	// that are objects will not be stored, or will not be stored correctly.
	//
	// *{{{useIEFallback}}} [**true**]: (boolean) Use the #userData behavior of Internet Explorer versions 6 & 7, which
	// behaves similarly to localStorage.
	//
	// *{{{daysBeforeExpiring}}} [**365**]: (float) The default amount of days for an item to last before it expires;
	// if days argument is not passed to setItem method.
	//
	// *{{{saveTypeMetadata}}} [**false**]: (boolean) Whether or not the type of the item (i.e. 'localStorage') should
	// be saved. The default for this is false to save space. (Does not work for cookies)
	//
	options: {
		allowCookies: false,
		useIEFallback: true,
		daysBeforeExpiring: 365,
		saveTypeMetadata: false
	},

	// ** {{{ AC.Storage.setOption(key, value) }}} **
	//
	// A setter method, if you want to change an option.
	//
	// //note:// This affects all future AC.Storage items for this page until
	// it is refreshed or the user navigates away/closes the browser.
	//
	setOption: function(key, value){
		return this.options[key] = value;
	},

	// ** {{{ AC.Storage.storageType(days) }}} **
	//
	// Determines which storage technology we should use.
	//
	// Accepts a 'days' argument to determine if we want
	// localStorage or sessionStorage. 0 Days means Session.
	//
	storageType: function (days) {
		days = parseFloat(days);
		if(days === 0 && AC.Detector.hasSessionStorage()){
			return this.item.types['s'];

		} else if(AC.Detector.hasLocalStorage()){
			return this.item.types['l'];
		
		} else if(!!this.options.useIEFallback && this.IE.canAddBehavior()){
			return this.item.types['u'];

		} else if(!!this.options.allowCookies && AC.Detector.hasCookies()){
			return this.item.types['c'];
		}

		return null;
	},

	// === Setter/Getter/Remove Methods ===

	// ** {{{ AC.Storage.setItem(key, value, days) }}} **
	//
	// Sets the key/value pair using the appropriate storage method.
	// Sets an expiration date if needed as well.
	//
	// Value can be a string, array, number, boolean, object, or date.
	//
	// Metadata is an object that can contain any information you want
	// to store about your item. It can be accessed using the {{{AC.Storage.getItemObject}}}
	// method. The reserved keywords are '**type**','**days**','**v**','**e**',
	// '**t**','**r**','**value**','**expires**'
	//
	// Consider using as few characters as possible by having a lookup table
	// in your code to map single characters to string describing what the
	// metadata property means.
	//
	// By using the metadata property: {{{roundsDateTo}}}, you can override the
	// accuracy of the date expiration feature (currently as accurate as 1 day).
	// Set it in milliseconds.
	//
	setItem: function (key, value, days, metadata) {
		if(key == ''){ return false; }
		days = parseFloat(days);
		if(isNaN(days)) days = null;
		if(typeof days == 'undefined' || days === null){ days = this.options.daysBeforeExpiring; }
		if(typeof metadata !== 'object'){ metadata = {}; }

		// Figure out which technology we can use based on availability
		// and the amount of days before expiring (0 days = Session)
		switch(this.storageType(days)){
			// If we can use localStorage
			case this.item.types['l']:
				// If we wanted session storage, but it's not available, keep for 1 day
				if(days === 0){ days = 1; }
				// using days = -1 to remove item? Like a cookie
				//else if (days < 0){ return this.removeItem(key); }
				
				// Set the item using the AC.Storage.item.create method
				// Use a try loop in case we go over the quota
				try{
					metadata.days = days;
					if(this.options.saveTypeMetadata){ metadata.type = 'l'; }
					localStorage.setItem(key, this.item.create(value, metadata));
					return value;
				} catch(err){
					try{ console.warn(err); /* console.log(key); */ } catch(e){}
					return false;
				}
				
				break;

			// If we can use sessionStorage and the data only lasts for the session (0 days)
			case this.item.types['s']:
				// Set the item using the AC.Storage.item.create method
				// Use a try loop in case we go over the quota
				try{
					metadata.days = 0;
					if(this.options.saveTypeMetadata){ metadata.type = 's'; }
					sessionStorage.setItem(key, this.item.create(value, metadata));
					return value;
				} catch(err){
					try{ console.warn(err); /* console.log(key); */ } catch(e){}
					return false;
				}
				break;

			// Fallback for older IE browsers
			case this.item.types['u']:
				return this.IE.setItem(key, value, days, metadata);
				break;


			// Fallback for fallback...
			case this.item.types['c']:
				return this.cookie.setItem(key, value, days);
				break;
		}
	},

	// ** {{{ AC.Storage.getItem(key) }}} **
	//
	// Returns the value for a key, or null if none exists.
	// This will check every available method for storing
	// keys through AC.Storage, and return the first positive
	// result it finds.
	//
	// //note:// The localStorage.getItem method still works when private browsing
	// is turned on, but AC.Detector.hasLocalStorage() will return false, so AC.Storage.getItem
	// does not work in private browsing mode.
	//
	getItem: function (key) {
		if(this.hasExpired(key)){ this.removeItem(key); return null; }
		var value = this.getItemObject(key);
		if(value === null || typeof value === 'undefined'){ return null; }
		else if(typeof value === 'object' && 'value' in value){ return value.value; }
		else { return value; }
	},

	// ** {{{ AC.Storage.getItemObject(key) }}} **
	//
	// Returns the value for a key, or null if none exists.
	// This will check every available method for storing
	// keys through AC.Storage, and return the first positive
	// result it finds.
	//
	getItemObject: function (key) {
		var obj,
			objAsString;
		if(AC.Detector.hasLocalStorage()){
			objAsString = localStorage.getItem(key);
			obj = this.item.read(objAsString);
			if(obj !== null && typeof obj != "undefined") return obj;
		}
		if(AC.Detector.hasSessionStorage()){
			objAsString = sessionStorage.getItem(key);
			obj = this.item.read(objAsString);
			if(obj !== null && typeof obj != "undefined") return obj;
		}
		if(!!this.options.useIEFallback && this.IE.canAddBehavior()) {
			obj = this.IE.getItem(key);
			if(obj !== null && typeof obj != "undefined") return obj;
		}
		if(!!this.options.allowCookies && AC.Detector.hasCookies()){
			obj = this.cookie.getItem(key);
			if(obj !== null && typeof obj != "undefined") return obj;
		}
		
		return null
	},

	// ** {{{ AC.Storage.removeItem(key) }}} **
	//
	// Removes all instances of a key from all methods that AC.Storage supports.
	//
	removeItem: function (key) {
		if(AC.Detector.hasLocalStorage()){
			localStorage.removeItem(key);
		}
		if(AC.Detector.hasSessionStorage()){
			sessionStorage.removeItem(key);
		}
		if(!!this.options.useIEFallback && this.IE.canAddBehavior()) {
			this.IE.removeItem(key);
		}
		if(!!this.options.allowCookies && AC.Detector.hasCookies()){
			this.cookie.removeItem(key);
		}
		
		return key;
	},

	// === Expiration Methods ===

	// ** {{{ AC.Storage.createExpirationDate(days, fromDate) }}} **
	//
	// Figure out the expiration date based on the current date or the supplied date object (fromDate),
	// and the amount of days until it is set to expire (days).
	//
	createExpirationDate: function(days, fromDate){
		if(typeof fromDate == "undefined" || !('getHours' in fromDate)){ fromDate = new Date(); }
		fromDate.setTime(fromDate.getTime() + (days * 24 * 60 * 60 * 1000));
		return fromDate.getTime(); // Return as time stamp (e.g. 1322849543460)
	},

	// ** {{{ AC.Storage.getExpirationDate(key) }}} **
	//
	// Returns the expiration date (as a Date object) for a key if it is localStorage or sessionStorage.
	// Returns null for cookies and #userData, even if they have an expiration date.
	//
	getExpirationDate: function(key){
		var obj = this.getItemObject(key);
		if(typeof obj === 'string' || typeof obj === 'number'){ return null; }
		if(obj != null && typeof obj !== 'undefined' && 'expires' in obj) return new Date(obj.expires);
		else return null;
	},

	// ** {{{ AC.Storage.hasExpired(key) }}} **
	//
	// Checks to see if a localStorage or #userData item has an expiration date and the current date
	// is greater than that expiration date.
	//
	// Returns true if the item has expired, returns false if it has not, does not have an expiration date,
	// does not exist, or we don't know when it expires (i.e. not created with AC.Storage).
	hasExpired: function(key){
		if(typeof key == "undefined" || key.length === 0){ return false; }
		var date = new Date().getTime();
		if(AC.Detector.hasLocalStorage()){
			var expires = this.getExpirationDate(key);
			if(expires !== null && expires.getTime() < date){ return true; }
		}
		
		return false;
	},

	// ** {{{ AC.Storage.removeExpired() }}} **
	//
	// Removes all localStorage values that have expired.
	//
	// //Note:// The remove function also removes any cookies, sessionStorage, or #userData
	// values with the same key.
	//
	removeExpired: function(){
		if(AC.Detector.hasLocalStorage()){
			for(i=0;i<localStorage.length;i++){
				var key = localStorage.key(i);
				if(this.hasExpired(key)){
					this.removeItem(key);
				}
			}
			return true;
		}
		
		return false;
	},

	// === Item-related Methods ===
	//
	// For use with localStorage, sessionStorage, and #userData
	//
	// Since we want to use as little of the quota per item as
	// necessary, use a one char code when saving out data.
	//
	item: {
	
		// ** {{{ AC.Storage.item.roundDatesTo }}} **
		//
		// To save space in our quota, we can divide the timestamp of every item
		// when saving it out, then multply it back when we read the data.
		//
		// This means expiration can only be as precise as 1 day
		//
		roundDatesTo: 1000 * 60 * 60 *24, // days (1000ms * 60s * 60m * 24hr = 1 day)
	
		// ** {{{ AC.Storage.item.dateKey }}} **
		//
		// To save space in our quota, we can subtract this number from the timestamp of every item when
		// saving it out, before rounding to hours, then add it back when we read the data.
		//
		dateKey: 1293868800000, // new Date('Jan 01 2011').getTime()
	
		// ** {{{ AC.Storage.item.codes }}} **
		//
		// This object is a lookup table to parse the data back.
		//
		codes: {
			'v': 'value',
			'e': 'expires',
			't': 'type',
			'r': 'roundsDateTo'
		},
	
		// ** {{{ AC.Storage.item.types }}} **
		//
		// Since we want to use as little of the quota per item as
		// necessary, use a one char code when saving out data.
		//
		// This object is a lookup table to parse type of data that
		// we're saving out.
		//
		types: {
			'l': 'localStorage',
			's': 'sessionStorage',
			'u': '#userData',
			'c': 'cookies'
		},
	
		// ** {{{ AC.Storage.item.create(key, value, days) }}} **
		//
		// Creates a string that contains all the data for this item, to be
		// saved in storage.
		//
		create: function(value, metadata){
			if(!metadata) metadata = {};
			var obj = {},
				roundDate = this.roundDatesTo;
			
			obj.v = value;
			if('roundsDateTo' in metadata && !isNaN(metadata.roundsDateTo)){
				obj.r = metadata.roundsDateTo;
				roundDate = metadata.roundsDateTo;
			}
			if('days' in metadata && metadata.days !== 0) obj.e = Math.round(AC.Storage.createExpirationDate(metadata.days) / roundDate) - Math.round(this.dateKey / roundDate);
			if('type' in metadata && metadata.type in this.types) obj.t = metadata.type;
			for(md in metadata){
				if(
					md !== 'days' &&
					md !== 'value' &&
					md !== 'expires' &&
					md !== 'type' &&
					!(md in this.codes)
				){ obj[md] = metadata[md]; }
			}
			
			return JSON.stringify(obj);
		},
	
		// ** {{{ AC.Storage.item.read(objAsString) }}} **
		//
		// Takes in the raw string value from storage and converts
		// it to a data object.
		//
		read: function(objAsString){
			var objFromString = this.parse(objAsString);
			if(objFromString == null){ return null; }
			var obj = {};
			var roundDate = this.roundDatesTo;
			for(k in objFromString){
				if(k in this.codes){
					if(this.codes[k] == 'expires') {
						if('r' in objFromString){ roundDate = objFromString.r; }
						obj[this.codes[k]] = (objFromString[k] * roundDate) + Math.round(this.dateKey / roundDate) * roundDate;
					}
					else if(this.codes[k] == 'type') obj[this.codes[k]] = this.types[objFromString[k]];
					else obj[this.codes[k]] = objFromString[k];
				} else { obj[k] = objFromString[k]; }
			}
			return obj;
		},

		parse: function(string){
			try {
				return JSON.parse(string, function (key, value) {
					var d,a;
					if (typeof value === 'string') {
						// Parse ISO Date (with and without extra quotes)
						if(!d) d = /^\"*(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z\"*$/.exec(value);
						if (d) { return new Date(Date.UTC(+d[1], +d[2] - 1, +d[3], +d[4], +d[5], +d[6])); }
	
						// Arrays 
						a = /^\[(.*)\]$/.exec(value);
						// Use this method instead of JSON.parse directly so
						// we can parse nested arrays and dates.
						if (a) { return this.parse(value); }
					}
					return value;
				}.bind(this));
			} catch(e){
					try{ console.warn(err); /* console.log(key); */ } catch(e){}
				return string;
			}
		}
	},

	// === IE-Specific Methods ===
	IE: {

		// ** {{{ AC.Storage.IE.setItem(key, value, days) }}} **
		//
		// This function will set a #userData attribute, a fallback for
		// HTML5 localStorage on IE6/7
		//
		setItem: function(key, value, days, metadata){
			// Make sure the #userData behavior has been added
			if(this.canAddBehavior()){
				var el = this.element();

				// Set the value
				if(typeof metadata !== 'object'){ metadata = {}; }
				var item = AC.Storage.item.create(value, metadata);
				el.setAttribute(this.attribute,item);

				// Figure out expiration date
				days = parseFloat(days);
				// If we wanted session storage, but it's not available, keep for 1 day
				if(days === 0){ days = 1; }
				else if(isNaN(days)){ days = AC.Storage.options.daysBeforeExpiring; }
				var date = new Date(AC.Storage.createExpirationDate(days));

				// Set expiration date
				if('toUTCString' in date){ el.expires = date.toUTCString(); }

				// Save the #userData attributes to the key
				el.save(key);

				return value;
			}
			return false;
		},
	
		// ** {{{ AC.Storage.IE.getItem(key) }}} **
		//
		// Returns the value of a #userData attribute, or null if there is no value.
		//
		getItem: function (key) {
			// Make sure the #userData behavior has been added
			if(this.canAddBehavior()){
				var el = this.element();
				el.load(key);
				var valRaw = el.getAttribute(this.attribute);
				var value = AC.Storage.item.read(valRaw);
				delete valRaw;
				if(value === null || value.toString() === "" || value.value === null || value.value.toString() === "" || typeof value === 'undefined' || typeof value.value === 'undefined'){ return null; }
				else if(typeof value === 'object' && 'value' in value){ return value.value; }
				else { return value; }
			}
			return null;
		},
	
		// ** {{{ AC.Storage.IE.removeItem(key) }}} **
		//
		// Removes an instance of #userData for the key provided, if one exists.
		//
		removeItem: function (key) {
			if(this.canAddBehavior()){
				var el = this.element();
				el.load(key);
				el.removeAttribute(this.attribute);
				el.save(key);

				return true;
			}
			return false;
		},

		// ** {{{ AC.Storage.IE.attribute }}} **
		//
		// A string used as the attribute that is added to the this.element() tag.
		// Used for storing the value as a #userData item.
		//
		attribute: 'content',

		// ** {{{ AC.Storage.IE.canAddBehavior }}} **
		//
		// Keep track of whether or not we've added the #userData behavior to the page.
		//
		canAddBehavior: function(){
			if('addBehavior' in document.body){
				var el = this.element();
				if('addBehavior' in el && typeof el !== 'undefined' && 'load' in el && 'save' in el){ return true; }
			}
			return false;
		},

		// ** {{{ AC.Storage.IE.element }}} **
		//
		// Keep track of whether or not we've added the #userData behavior to the page.
		//
		_element: null,
		element: function(){
			if(this._element === null){
				this._element = document.createElement('meta');
				this._element.setAttribute('name','ac-storage');
				this._element.style.behavior = "url('#default#userData')";
				document.head.appendChild(this._element);
			}
			return this._element;
		}
	},

	// === Cookie-Specific Methods ===
	cookie: {
		// ** {{{ AC.Storage.cookie.setItem(key, value, days) }}} **
		//
		// This function will create a cookie. For a session cookie, use 0 for the days
		//
		setItem: function (key, value, days) {
			if(AC.Detector.hasCookies()){
				if(typeof days == 'undefined' || days === null){ days = this.options.daysBeforeExpiring; }
				var expires = (days === 0) ? '' : '; expires=' + new Date(AC.Storage.createExpirationDate(days)).toUTCString();
				document.cookie = cookie = key + '=' + value + expires + '; path=/';
				return value;
			}
			return false;
		},
	
		// ** {{{ AC.Storage.cookie.getItem(key) }}} **
		//
		// This function will read a cookie.
		//
		getItem: function (key) {
			var keyEQ = key + '=';
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' '){ c = c.substring(1, c.length); }
				if (c.indexOf(keyEQ) == 0){ return c.substring(keyEQ.length, c.length); }
			}
			return null;
		},
	
		// ** {{{ AC.Storage.cookie.removeItem(key) }}} **
		//
		// This function will remove a cookie.
		//
		removeItem: function (key) {
			this.setItem(key, '', -1);
		}
	}
};



// = **AC.Synthesize** =
//
// //@ author:// Kyle Olson
//
// AC.Synthesize is an object with methods that automatically make getter and setter
// methods for you based on the existence of private variables.
//
// == Dependencies ==
//
// * Prototype
//

// == Why? ==
//
// Getter and Setter methods are used to control how external scripts can access your
// object's member data. There are any number of reasons why you might want to do this,
// but just a couple examples are:
//
// * To validate the value you're trying to set will work for the intended use of your
//	variable.
//
// * To create hooks any time a variable changes, in case you need to update something
//	else in your script at that time.
//
// * To calculate the value of the variable at the time of getting it.
//

// == Naming Convention ==
//
// We follow the convention from Objective-C for naming getter/setter methods. If your
// variable is called '_variable', then the getter method would be 'variable' (without
// the _) and the setter would be 'setVariable' (notice the camelCase).
//

// == Usage ==
//
// There are three ways to synthesize your objects:
//
// * Run {{{Object.synthesize}}} on your object.
//
// **Example:**
// {{{
// var myObj = Object.synthesize({
// 	...
// });
//
// }}}
//
// * Pass your object to {{{AC.Synthesize.synthesize}}} directly.
//
// **Example:**
// {{{
// var myObj = { ... };
// AC.Synthesize.synthesize(myObj);
// }}}
//
// * Extend your object with {{{AC.Synthesize}}} and call synthesize on itself
//	(at the end of initialize in a Prototype Class, for example).
//
// **Example:**
// {{{
// var myObj = function () {
// 	this.synthesize();
// };
// myObj.prototype = Object.extend(Object.clone(AC.Synthesize), {
// 	...
// });
//
// }}}
//
// **Example:**
// {{{
// var myObj = Object.extend(Object.clone(AC.Synthesize), {
// 	initialize: function () {
// 		this.synthesize();
// 	},
// 	...
// });
//
// }}}
//

// == Applicable Variables ==
//
// Variables that are applicable to receive setters/getters are determined
// by two conditions:
//
// * Its key is preceded by '_' (e.x. _key)
//
// * It is not of the type "function"
//
// A variable preceded by __ (two underscores) is ignored by AC.Synthesize. This is
// a convention you can use to make variables that are private, which is to say
// that they are not intended to be touched or used at all outside of the context
// of the object that holds it.
//
// **Note:** Variables preceded by a single _ are also considered private, which is
// why you're creatng getter/setter methods in the first place. External scripts are
// not intended to directly touch those variables. Instead they should access them
// through the getter/setter methods.
//

// == Custom Getters/Setters ==
//
// To have custom getter/setter methods for your variables, you simply define them
// in your object before synthesizing. Before setting either method, AC.Synthesize
// will check to see if there is already a value for the variable that follows the
// naming convention for getters/setters. If there already is something defined, it
// ignores it.
//
// **Note:** Custom getter methods are still expected to return the final value
// of the variable after it has been gotten.
//
// **Note:** If you want neither a getter nor a setter for your variable, consider
// using the __ syntax described above. Do not provide null/useless values for the
// getter/setter variable names following the naming convention for your variable.
//

// == Methods ==
//
AC.Synthesize = {
	// ** {{{ AC.Synthesize.synthesize(self) }}} **
	//
	// This is the method you call to synthesize your object. If you have extended
	// your object with AC.Synthesize, then you do not need to pass any arguments
	// to this method (i.e. if 'this' inside of your method would be the object
	// you're trying to synthesize).
	//
	// Otherwise you can provide an object to it directly.
	//
	synthesize: function (self) {
		if (typeof self !== 'object') {
			self = this;
		}

		var name, privateVariable;

		// Check all properties under self, ignore inherited properties
		for (privateVariable in self) {
			if (self.hasOwnProperty(privateVariable)) {
				// Check that first character is private variable indicator '_' and not '__'
				if (privateVariable.charAt(0) === '_' && !(privateVariable.charAt(1) === '_')) {
					// Don't create getter/setters for functions
					if (typeof self[privateVariable] !== 'function') {
						this.__synthesizeGetter(privateVariable, self);
						this.__synthesizeSetter(privateVariable, self);
					}
				}
			}
		}
	},

	// ** {{{ AC.Synthesize.__synthesizeGetter(privateVariable, self) }}} **
	//
	// Private method for creating a setter when synthesizing a private variable
	// if one doesn't already exist.
	//
	__synthesizeGetter: function (privateVariable, self) {
		// Get name of getter function
		var functionName = privateVariable.slice(1, privateVariable.length);

		// Define getter if not already defined
		if (typeof self[functionName] === 'undefined') {
			self[functionName] = function () {
				return self[privateVariable];
			}
		}
	},

	// ** {{{ AC.Synthesize.__synthesizeSetter(privateVariable, self) }}} **
	//
	// Private method for creating a setter when synthesizing a private variable
	// if one doesn't already exist.
	//
	__synthesizeSetter: function (privateVariable, self) {
		var functionName = privateVariable.slice(1, privateVariable.length);
		functionName = 'set' + functionName.slice(0, 1).toUpperCase() + functionName.slice(1, functionName.length);

		// Define setter if not already defined
		if (typeof self[functionName] === 'undefined') {
			self[functionName] = function (value) {
				self[privateVariable] = value;
			}
		}
	}
};

// ** {{{ Object.synthesize(obj) }}} **
//
// As a shortcut to extending your object with a clone of {{{AC.Synthesize}}}
// and running synthesize() on the object after the fact, you can pass your
// object to {{{Object.synthesize}}}.
//
Object.synthesize = function (obj) {
	if (typeof obj === 'object') {
		// Create new instance of AC.Synthesize and extend it with your object
		Object.extend(obj, Object.clone(AC.Synthesize));

		// Synthesize member data in extended object
		obj.synthesize();
		return obj;
	} else {
		try { console.warn('Argument supplied was not a valid object.'); } catch (e) {}
		return obj;
	}
};
