var alreadyAgreed = false;
Event.onDOMReady(function() {
	var delegate = {};
	delegate.createCloseButton = function(obj) {
		return document.createElement('div').appendChild(document.getElementById('disagree-text'));
	};
	delegate.willShow = function(obj, content) {
		if (alreadyAgreed) {
			var screenDiv = $$('.lightbox-screendoor');
			if (screenDiv && screenDiv[0]) {
				screenDiv[0].remove();
			}
			var frameDiv = $$('.lightbox-frame');
			if (frameDiv && frameDiv[0]) {
				frameDiv[0].remove();
			}
			document.location = obj._currentEvent.target.rel;
			return false;
		}
		else {
			if ($('agreementCheckbox').checked) {
				$('download').removeClassName('disabled');
			}
			else {
				$('download').addClassName('disabled');
			}
			var href;
			var evt = obj.currentEvent();
			var elm = evt.target || evt.srcElement;
			while (elm && elm.nodeName.toUpperCase() !== 'A' && elm.parentNode) {
				elm = elm.parentNode;
			}
			if (elm) {
				href = elm.rel;
			}
			if (href) {
				var closeFunc = function(event) {
					var element = event.target;
					if (element.nodeName == 'SPAN') {
						element = element.parentNode;
					}

					// don't allow the click if the button is disabled
					if (element.hasClassName('disabled')) {
						Event.stop(event);
						return false;
					}

					alreadyAgreed = true;
					
					var to = setTimeout(function() { lightbox.close(obj); to = null; }, 1);
				};
				var downloadButton = document.getElementById('download');
				if (typeof(downloadButton.setAttribute) === 'function') {
					downloadButton.setAttribute('href', href);
				} else {
					downloadButton.href = href;
				}
				if (downloadButton.addEventListener) {
					downloadButton.addEventListener('click', closeFunc, false);
				} else {
					downloadButton.attachEvent('onclick', closeFunc);
				}
			}
		}
	};
	var lightbox = new AC.LightBox({animationDuration: .2, useScreenDoor: false});
	lightbox.setDelegate(delegate);
	
	// keep the overlay centered on when scrolling. Use CSS transitions if possible
	if (AC.Detector.isMobile()) {
		lightbox.options.doesRecenter = false;
	}

	// if an agreement checkbox exists, use that to toggle the agree button state
	if ($('agreementCheckbox')) {
		Event.observe('agreementCheckbox', 'click', function(event) {
			if (this.checked) {
				$('download').removeClassName('disabled');
			}
			else {
				$('download').addClassName('disabled');
			}
		});
	}
	// otherwise, add an onscroll event to activate the agree button when the bottom is reached
	else {
		Event.observe('agreement_scroll', 'scroll', function(event) {
			if (this.scrollHeight - this.scrollTop == this.getHeight()) {
				$('download').removeClassName('disabled');
			}
		});
	}
});