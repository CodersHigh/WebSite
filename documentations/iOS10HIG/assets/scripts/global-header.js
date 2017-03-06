var body, search, searchInput, searchReset, searchSpacer, searchCompletion, recommended, searchSubmit;
var canSearch;

function resetDisplay() {
	if(searchInput.val() === '') {
		searchReset.removeClass('enable');
	} else {
		searchReset.addClass('enable');
		searchSubmit.removeAttr('disabled');
		searchReset.removeAttr('disabled');
	}
}

function clearInput() {
	searchInput.val('');
	searchSpacer.text('');
	searchCompletion.text('');
	recommended.addClass('hidden');
	resetDisplay();

}

function searchFocus() {
	//jQuery('.gh-nav-account').removeClass('logged-in');
	search.addClass('enhance');
	setTimeout(function() {
		searchInput.focus();
		canSearch = true;

	}, 300);
}

function searchBlur() {
	//jQuery('.gh-nav-account').addClass('logged-in');
	clearInput();
	if (search.hasClass('enhance')) {
		search.removeClass('enhance');
		searchSubmit.attr('disabled', 'disabled');
		searchReset.attr('disabled', 'disabled');
	}
	canSearch = false;
}


jQuery(document).ready(function() {

	body = jQuery('body');
	search = jQuery('li.gh-nav-search');
	searchInput = jQuery('#gh-search-input');
	searchSubmit = jQuery('#gh-search-submit');
	searchReset = jQuery('#gh-search-reset');
	searchSpacer = jQuery('span.spacer');
	searchCompletion = jQuery('span.completion');
	recommended = jQuery('.recommended');
	canSearch = false;

	search.click(function() {
		if (jQuery(window).width() > 1024 && canSearch === false) {
			searchFocus();
		}
	});

	searchInput.keyup(resetDisplay);

	searchReset.click(function(event){
		event.preventDefault();
		clearInput();
		searchFocus();
	});


});

jQuery(window).resize(function() {
	if (jQuery(window).width() < 1024) {
		searchBlur();
		searchSubmit.removeAttr('disabled');
	} else if (jQuery(window).width() >= 1024) {
		searchSubmit.attr('disabled', 'disabled');
	}
	if (jQuery(window).width() >= 768) {
		if (jQuery('body').hasClass('gh-show-nav')) {
			jQuery('body').removeClass('gh-show-nav');
		}
		if (jQuery('.subnav').hasClass('enhance')) {
			jQuery('.subnav').removeClass('enhance');
		}
	}
});

jQuery(window).scroll(function() {
	if(window.scrollY) {
		if (jQuery('body').hasClass('gh-show-nav')) {
			jQuery('body').removeClass('gh-show-nav');
			jQuery('.subnav').removeClass('hidden');
		}
		if (jQuery('.subnav').hasClass('enhance')) {
			jQuery('.subnav').removeClass('enhance');
		}
	}
});

jQuery(document).click(function(event) {
	if (canSearch === true) {
		var target = jQuery(event.target);
		if( !target.is(searchReset) && !target.is(searchInput) && !target.is(search) && !target.is(searchSubmit) ){
			searchBlur();
		}
	}
});
