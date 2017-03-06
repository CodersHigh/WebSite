// = Apple.com Detection Library =
// 
// A package consisting of a variety of functions for detecting various
// capabilities about a specified user agent.
// 
// While browser detection is frowned up, there is a definite need at times.
// Just use it for the right reasons.
// 
// Be sure to check the extensive unit testing for this package in 
// the sandbox. But keep in mind that optimizations made to this file have
// broken the tests. Specifically, anytime the result of the test is cached
// the test is not re-evaluated.
// 

if (typeof(AC) === 'undefined') {
	AC = {};
}

// == AC.Detector ==
// The package all detection functions are stored within.
AC.Detector = {

	// ** {{{ AC.Detector.getAgent() }}} **
	// 
	// Returns the name of the user agent, normalized as all lower case.
	getAgent: function() {
		return navigator.userAgent.toLowerCase();
	},

	// ** {{{ AC.Detector.isMac() }}} **
	// 
	// Returns whether or not the platform is a Mac.
	isMac: function(userAgent) {
		var agent = userAgent || this.getAgent();
		return !!agent.match(/mac/i);
	},

	// ** {{{ AC.Detector.isSnowLeopard() }}} **
	// 
	// **DEPRECATED**
	// Use {{{ AC.Detector.macOSAtLeastVersion('10.6') }}}
	// 
	// Returns whether or not the OS is Snow Leopard
	isSnowLeopard: function(userAgent) {
		if (typeof console != 'undefined') console.warn('Instead of AC.Detector.isSnowLeopard, please use AC.Detector.macOSAtLeastVersion("10.6").');
		var agent = userAgent || this.getAgent();
		return !!agent.match(/mac os x 10_6/i);
	},

	// ** {{{ AC.Detector.macOSVersion(userAgent) }}} **
	// 
	// Returns an array of integers defining the OS version of the Mac operating system the
	// user is running, or null if the user is not using a Mac
	// 
	// Example output: OSX 10.6.6 = [10,6,6];
	// 
	// Can take a custom userAgent, otherwise get's the user's userAgent
	// 
	macOSVersion: function(userAgent) {
		var agent = userAgent || this.getAgent();

		// if we're not on a mac, we can't have a mac os version
		if (!this.isMac(agent)) {
			return null;
		}

		var version = agent.match(/(mac os x )([\d\._]*)/i);
		if (version == null) {
			return version;
		}
		if (!!version[2].match(/\./)) {
			version = version[2].split('.');
		} else {
			version = version[2].split('_');
		}

		// convert the array of strings to an array of ints
		for (var i=0; i<version.length; i++) {
			version[i] = parseInt(version[i]);
		}
		return version;
	},

	// ** {{{ AC.Detector.macOSAtLeastVersion(required) }}} **
	// 
	// Returns a boolean whether or not the os version of the user's device is greater than or
	// equal to the one supplied. If the user is not on a Mac, it returns false
	// 
	// Input can be a string (e.g. '10.6.6' or '10.6') or an array (e.g [10,6,6] or [10,6])
	// 
	macOSAtLeastVersion: function(required, userAgent) {
		if (typeof required == 'undefined') {
			return false;
		}

		var version = this.macOSVersion(userAgent);
		if (version == null) {
			return false;
		}
		if (typeof required == 'string') {
			required = required.replace('.', '_').split('_');
		}

		for (var i=0; i<required.length; i++) {
			// If we don't know enough information about the OS version,
			// assume the number to test against is 0, i.e. 10.6 == 10.6.0
			var t = parseInt(version[i]);
			if (isNaN(t)) {
				t = 0;
			}
			if (parseInt(required[i]) > t) {
				return false;
			}
		}

		return true;
	},

	// ** {{{ AC.Detector.isWin() }}} **
	// 
	// Returns whether or nor the platform is Windows, regardless of version.
	isWin: function(userAgent) {
		var agent = userAgent || this.getAgent();
		return !!agent.match(/win/i);
	},

	// ** {{{ AC.Detector.winVersion() }}} **
	// 
	// Returns Windows version as float. If not Windows, returns false.
	winVersion: function(userAgent) {
		var agent = userAgent || this.getAgent();
		if (this.isWin(agent)) {
			var version = agent.match(/nt\s*([\d\.]*)/);
			if (version && version[1]) {
				return parseFloat(version[1]);
			}

			return true;
		}
		return false;
	},

	// ** {{{ AC.Detector.winAtLeastVersion(required) }}} **
	// 
	// Returns a boolean whether or not the os version of the user's windows is greater than or
	// equal to the one supplied. If the user is not on a Windows, or is of unknown Windows
	// version (e.g. Win98) it returns false.
	// 
	// Input should be a float (e.g. 5.1 or '10.6').
	// 
	// A good reference, for Windows versions is available here:
	// http://msdn.microsoft.com/en-us/library/ms537503(v=vs.85).aspx
	// 
	winAtLeastVersion: function(required, userAgent) {
		if (typeof required == 'undefined') {
			return false;
		}
		required = parseFloat(required);
		if (required === NaN) {
			return false;
		}

		var version = this.winVersion(userAgent);
		if (version === null || version === false || version === true) {
			return false;
		}

		return (required <= version);
	},

	// ** {{{ AC.Detector.isWin2k() }}} **
	// 
	// Returns whether or not the platform is Windows 2000.
	isWin2k: function(userAgent) {
		var agent = userAgent || this.getAgent();
		return this.isWin(agent) && (agent.match(/nt\s*5/i));
	},

	// ** {{{ AC.Detector.isWinVista() }}} **
	// 
	// Returns whether or not the platform is Windows Vista.
	isWinVista: function(userAgent) {
		var agent = userAgent || this.getAgent();
		return this.isWin(agent) && (agent.match(/nt\s*6\.0([0-9]{0,2})?/i));
	},

	// ** {{{ AC.Detector.isWebKit() }}} **
	// 
	// Returns whether or not the user agent is using the webkit engine.
	isWebKit: function(userAgent) {
		if (this._isWebKit === undefined) {
			var agent = userAgent || this.getAgent();
			this._isWebKit =  !!agent.match(/AppleWebKit/i);
			this.isWebKit = function() {
				return this._isWebKit;
			};
		}
		return this._isWebKit;
	},

	// ** {{{ AC.Detector.isSafari2() }}} **
	// 
	// Returns whether or not the user agent is Safari 2.
	// 
	// **DEPRECATED**
	// Why are you using this?
	isSafari2: function(userAgent) {
		if (typeof console != 'undefined') console.warn('Instead of AC.Detector.isSafari2(), please use AC.Detector.isWebKit().');

		var agent = userAgent || this.getAgent();
		if (this._isSafari2 === undefined) {
			if (!this.isWebKit(agent)) {
				this._isSafari2 = false;
			} else {
				var version = parseInt(parseFloat(agent.substring(agent.lastIndexOf('safari/') + 7)), 10);
				this._isSafari2 = (version >= 419);
			}
			this.isSafari2 = function() {
				return this._isSafari2;
			};
		}
		return this._isSafari2;
	},

	// ** {{{ AC.Detector.isChrome() }}} **
	// 
	// Returns whether or not the user agent is Chrome.
	isChrome: function(userAgent) {
		if (this._isChrome === undefined) {
			var agent = userAgent || this.getAgent();
			this._isChrome = !!agent.match(/Chrome/i);
			this.isChrome = function() {
				return this._isChrome;
			};
		}
		return this._isChrome;
	},

	// ** {{{ AC.Detector.isiPhone() }}} **
	// 
	// **DEPRECATED**
	// Use {{{ AC.Detector.isMobile() }}}
	isiPhone: function(userAgent) {
		if (typeof console != 'undefined') console.warn('Instead of AC.Detector.isiPhone(), please use AC.Detector.isMobile().');
		var agent = userAgent || this.getAgent();
		return this.isMobile(agent);
	},

	// ** {{{ AC.Detector.iPhoneOSVersion() }}} **
	// 
	// **DEPRECATED**
	// Use {{{ AC.Detector.iOSVersion() }}}
	iPhoneOSVersion: function(userAgent) {
		if (typeof console != 'undefined') console.warn('Instead of AC.Detector.iPhoneOSVersion(), please use AC.Detector.iOSVersion().');

		var agent = userAgent || this.getAgent(),
		    isMobile = this.isMobile(agent),
		    OSString, OSStringParts, version;

		if (isMobile) {
			// now looks at user agent
			var OSString = agent.match(/.*CPU ([\w|\s]+) like/i);
			if (OSString && OSString[1]) {
				OSStringParts = OSString[1].split(' ');
				version = OSStringParts[2].split('_');
				return version;
			} else {
				return [1];
			}
		}
		return null;
	},

	// ** {{{ AC.Detector.isiPad() }}} **
	// 
	// Returns whether or not the platform is an iPad
	isiPad: function(userAgent) {
		var agent = userAgent || this.getAgent();
		return !!(this.isWebKit(agent) && agent.match(/ipad/i));
	},

	// ** {{{ AC.Detector.isMobile() }}} **
	// 
	// Returns whether or not the platform is an iPhone or an iPhone touch.
	isMobile: function(userAgent) {
		var agent = userAgent || this.getAgent();
		return this.isWebKit(agent) && (agent.match(/Mobile/i) && !this.isiPad(agent));
	},

	// ** {{{ AC.Detector.iOSVersion() }}} **
	// 
	// Returns iOS version as float. If not iOS, returns false.
	_iOSVersion: null,
	iOSVersion: function() {
		if (this._iOSVersion === null) {
			this._iOSVersion = (AC.Detector.isMobile() || AC.Detector.isiPad()) ? parseFloat(navigator.userAgent.match(/os ([\d_]*)/i)[1].replace('_', '.')) : false;
		}
		return this._iOSVersion;
	},

	// ** {{{ AC.Detector.isOpera() }}} **
	// 
	// Returns whether or not the user agent is Opera
	isOpera: function(userAgent) {
		var agent = userAgent || this.getAgent();
		return !!agent.match(/opera/i);
	},

	// ** {{{ AC.Detector.isIE() }}} **
	// 
	// Returns whether or not the user agent reports that it is IE.
	isIE: function(userAgent) {
		var agent = userAgent || this.getAgent();
		return !!agent.match(/msie/i);
	},

	// ** {{{ AC.Detector.isIEStrict() }}} **
	// 
	// Returns whether or not the is IE, and not another browser 
	// masquerading as IE.
	isIEStrict: function(userAgent) {
		var agent = userAgent || this.getAgent();
		return agent.match(/msie/i) && !this.isOpera(agent);
	},

	// ** {{{ AC.Detector.isIE8() }}} **
	// 
	// Returns whether or not the browser is IE8+
	isIE8: function(userAgent) {
		var agent = userAgent || this.getAgent();

		var match = agent.match(/msie\D*([\.\d]*)/i);
		if (match && match[1]) {
			version = match[1];
		}

		return (+version >= 8);
	},

	// ** {{{ AC.Detector.isFirefox() }}} **
	// 
	// Returns whether or not the user agent is Firefox.
	isFirefox: function(userAgent) {
		var agent = userAgent || this.getAgent();
		return !!agent.match(/firefox/i);
	},

	// ** {{{ AC.Detector.isiTunesOK() }}} **
	// 
	// Returns whether or not the platform is compatible with iTunes.
	isiTunesOK: function(userAgent) {
		var agent = userAgent || this.getAgent();
		if (this.isMac(agent)) return true;
		if (this.winAtLeastVersion(5.1, agent)) return true;
		return false;
	},

	// ** {{{ AC.Detector.isQTInstalled() }}} **
	// 
	// Returns whether or not the QuickTime plugin is installed.
	// 
	// Note that the iPhone is not regisetered by this, but is typically
	// treated as having QuickTime.
	_isQTInstalled: undefined,
	isQTInstalled: function() {

		if (this._isQTInstalled === undefined) {
			var qtInstalled = false;

			if (navigator.plugins && navigator.plugins.length) {

				for (var i=0; i<navigator.plugins.length; i++) {
					var plugin = navigator.plugins[i];

					if (plugin.name.indexOf('QuickTime') > -1) {
						qtInstalled = true;
					}
				}
			} else if (typeof(execScript) != 'undefined') {
				qtObj = false; // global variable written to by vbscript for ie
				execScript('on error resume next: qtObj = IsObject(CreateObject("QuickTimeCheckObject.QuickTimeCheck.1"))','VBScript');
				qtInstalled = qtObj;
			}

			this._isQTInstalled = qtInstalled;
		}
		return this._isQTInstalled;
	},

	// ** {{{ AC.Detector.getQTVersion() }}} **
	// 
	// Returns the version of QuickTime installed.
	// 
	getQTVersion: function() {
		var version = '0';

		if (navigator.plugins && navigator.plugins.length) {
			for (var i = 0; i < navigator.plugins.length; i++) {

				var plugin = navigator.plugins[i];

				// match: QuickTime Plugin X.Y.Z
				var match = plugin.name.match(/quicktime\D*([\.\d]*)/i);
				if (match && match[1]) {
					version = match[1];
				}
			}
		} else if (typeof(execScript) != 'undefined') {
			ieQTVersion=null;

			execScript('on error resume next: ieQTVersion = CreateObject("QuickTimeCheckObject.QuickTimeCheck.1").QuickTimeVersion','VBScript');

			if (ieQTVersion) {
				// ieQTVersion is comes back as '76208000' when 7.6.2 is installed.
				version = ieQTVersion.toString(16);
				version = [version.charAt(0), version.charAt(1), version.charAt(2)].join('.');
			}
		}

		return version;
	},

	// ** {{{ AC.Detector.isQTCompatible(required, actual) }}} **
	// 
	// Returns whether or not the {{{actual}}} version is considered
	// compatible with the {{{required}}} version.
	// 
	// Note that versions are expressed as dot-delimited strings.
	// 
	// {{{required}}}: The minimum version required
	// 
	// {{{actual}}}: The actual version available
	// 
	isQTCompatible: function(required, actual) {
		function areCompatible(required, actual) {

			var requiredValue = parseInt(required[0], 10);
			if (isNaN(requiredValue)) {
				requiredValue = 0;
			}

			var actualValue = parseInt(actual[0], 10);
			if (isNaN(actualValue)) {
				actualValue = 0;
			}

			if (requiredValue === actualValue) {
				if (required.length > 1) {
					return areCompatible(required.slice(1), actual.slice(1));
				} else {
					return true;
				}
			} else if (requiredValue < actualValue) {
				return true;
			} else {
				return false;
			}
		}

		var expectedVersion = required.split(/\./);
		var actualVersion = actual ? actual.split(/\./) : this.getQTVersion().split(/\./);

		return areCompatible(expectedVersion, actualVersion);
	},

	// ** {{{ AC.Detector.isValidQTAvailable(required) }}} **
	// 
	// Returns whether or not the QuickTime plugin installed is compatible
	// with the {{{required}}} version.
	// 
	// {{{required}}}: The minimum version required
	// 
	isValidQTAvailable: function(required) {
		return this.isQTInstalled() && this.isQTCompatible(required);
	},

	// ** {{{ AC.Detector.isSBVDPAvailable(required) }}} **
	// 
	// Returns whether or not the SBVDP plugin installed is compatible
	// with the {{{required}}} version.
	// 
	// {{{required}}}: The minimum version required
	// *note* default should be 9.0.115 for h.264 encoded movies
	// 
	isSBVDPAvailable: function(required) {
		return false;
	},

	// ** {{{AC.Detector.svgAsBackground(callback)}}}
	// Returns {{{true}}} if the current browser supports using an SVG image
	// as a CSS background-image, otherwise returns {{{false}}}.
	// 
	// {{{callback}}}: the function callback to use after the test is complete
	// and the current browser passes.
	// 
	_svgAsBackground: null,
	svgAsBackground: function(callback) {
		if (this._svgAsBackground === null) {
			var success = function() {
				AC.Detector._svgAsBackground = true;
				if (typeof(callback) == 'function') {
					callback();
				}
			}

			var img = document.createElement('img')
			img.setAttribute('src', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNzUiIGhlaWdodD0iMjc1Ij48L3N2Zz4%3D');

			if (img.complete) {
				img.style.visibility = 'hidden';
				img.style.position = 'absolute';
				document.body.appendChild(img);

				window.setTimeout(function() {
					AC.Detector._svgAsBackground = false;
					if (img.width >= 100) {
						document.body.removeChild(img);
						success();
					} else {
						document.body.removeChild(img);
					}
				}, 1);
			} else {
				this._svgAsBackground = false;
				img.onload = success;
			}
		} else {
			if (this._svgAsBackground && typeof(callback) == 'function') {
				callback();
			}
		}
		return this._svgAsBackground;
	},

	// ** {{{AC.Detector.isCSSAvailable(property)}}}
	// Returns {{{true}}} if the current browser supports the given CSS {{{property}}},
	// otherwise, returns {{{false}}}.
	// 
	// {{{property}}}: the CSS property to test, can be of the form:
	// * webkitBorderRadius, mozBorderRadius, etc.
	// * borderRadius
	// * -webkit-border-radius, -moz-border-radius, etc.
	// * border-radius
	// 
	_style: null,
	_prefixes: null,
	_preFixes: null,
	_css: null,
	isCSSAvailable: function(property) {
		if (!this._style) this._style = document.createElement('browserdetect').style;
		if (!this._prefixes) this._prefixes = '-webkit- -moz- -o- -ms- -khtml- '.split(' ');
		if (!this._preFixes) this._preFixes = 'Webkit Moz O ms Khtml '.split(' ');
		if (!this._css) this._css = {};

		property = property.replace(/([A-Z]+)([A-Z][a-z])/g, '$1\-$2').replace(/([a-z\d])([A-Z])/g, '$1\-$2').replace(/^(\-*webkit|\-*moz|\-*o|\-*ms|\-*khtml)\-/, '').toLowerCase();
		switch (property) {
			case 'gradient':
				if (this._css['gradient'] !== undefined) return this._css['gradient'];

				var property = 'background-image:',
				value1 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
				value2 = 'linear-gradient(left top,#9f9, white);';

				this._style.cssText = (property + this._prefixes.join(value1 + property) + this._prefixes.join(value2 + property)).slice(0,-property.length);
				this._css['gradient'] = (this._style.backgroundImage.indexOf('gradient') !== -1);
				return this._css['gradient'];

			case 'inset-box-shadow':
				if (this._css['inset-box-shadow'] !== undefined) return this._css['inset-box-shadow'];

				var property = 'box-shadow:',
				value = '#fff 0 1px 1px inset;';

				this._style.cssText = this._prefixes.join(property + value);
				this._css['inset-box-shadow'] = (this._style.cssText.indexOf('inset') !== -1);
				return this._css['inset-box-shadow'];

			default:
				var properties = property.split('-'),
				length = properties.length,
				Property, i, j;

				if (properties.length > 0) {
					property = properties[0];
					for (i=1; i<length; i++) {
						property += properties[i].substr(0, 1).toUpperCase() + properties[i].substr(1);
					}
				}
				Property = property.substr(0, 1).toUpperCase() + property.substr(1);

				if (this._css[property] !== undefined) return this._css[property];

				for (j=this._preFixes.length-1; j>=0; j--) {
					if (this._style[this._preFixes[j]+property] !== undefined || this._style[this._preFixes[j]+Property] !== undefined) {
						this._css[property] = true;
						return true;
					}
				}
				return false;

		}
		return false;
	},

	// ** {{{ AC.Detector.supportsThreeD() }}} **
	// 
	// Returns whether the browser supports the 3d media query.
	// 
	_supportsThreeD: false,
	supportsThreeD: function() {
		try {
			this._supportsThreeD = false;

			if ('styleMedia' in window) {
				this._supportsThreeD = window.styleMedia.matchMedium('(-webkit-transform-3d)');
			} else if ('media' in window) {
				this._supportsThreeD = window.media.matchMedium('(-webkit-transform-3d)');
			}

			// chrome returns all the values as true, but doesn't actually have 3d support
			if (!this._supportsThreeD) {
				if (!document.getElementById('supportsThreeDStyle')) {
					var style = document.createElement('style');
					style.id = 'supportsThreeDStyle';
					style.textContent = '@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),(-ms-transform-3d),(-webkit-transform-3d) { #supportsThreeD { height:3px } }';
					document.querySelector('head').appendChild(style);
				}

				if (!(div = document.querySelector('#supportsThreeD'))) {
					div = document.createElement('div');
					div.id = 'supportsThreeD';
					document.body.appendChild(div);
				}
				this._supportsThreeD = (div.offsetHeight === 3);
			}

			return this._supportsThreeD;
		} catch(e) {
			return false;
		}
	},

	// ** {{{ AC.Detector.hasLocalStorage() }}} **
	// 
	// Returns whether the browser supports HTML5 localStorage, and
	// does not have privacy mode enabled or cookies turned off.
	// 
	_hasLocalStorage: null,
	hasLocalStorage: function() {
		if (this._hasLocalStorage !== null) {
			return this._hasLocalStorage;
		}

		try {
			if (typeof localStorage !== 'undefined' && 'setItem' in localStorage) {
				localStorage.setItem('ac_browser_detect','test');
				this._hasLocalStorage = true;
				localStorage.removeItem('ac_browser_detect','test');
			} else {
				this._hasLocalStorage = false;
			}
		} catch(e) {
			this._hasLocalStorage = false;
		}
		return this._hasLocalStorage;
	},

	// ** {{{ AC.Detector.hasSessionStorage() }}} **
	// 
	// Returns whether the browser supports HTML5 sessionStorage, and
	// does not have privacy mode enabled or cookies turned off.
	// 
	_hasSessionStorage: null,
	hasSessionStorage: function() {
		if (this._hasSessionStorage !== null) {
			return this._hasSessionStorage;
		}

		try {
			if (typeof sessionStorage !== 'undefined' && 'setItem' in sessionStorage) {
				sessionStorage.setItem('ac_browser_detect','test');
				this._hasSessionStorage = true;
				sessionStorage.removeItem('ac_browser_detect','test');
			} else {
				this._hasSessionStorage = false;
			}
		} catch(e) {
			this._hasSessionStorage = false;
		}
		return this._hasSessionStorage;
	},


	// ** {{{ AC.Detector.hasCookies() }}} **
	// 
	// Returns whether the browser has cookies turned on.
	// 
	_hasCookies: null,
	hasCookies: function() {
		if (this._hasCookies !== null) {
			return this._hasCookies;
		}
		this._hasCookies = ('cookie' in document && !!navigator.cookieEnabled) ? true : false;
		return this._hasCookies;
	}

};


