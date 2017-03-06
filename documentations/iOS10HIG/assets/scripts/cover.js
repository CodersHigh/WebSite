var href;
var checkbox;
var topOffset;

$(document).ready(function() {
	href = $('.overlay-trigger').attr('rel');
	checkbox = $('#agreementCheckbox')[0];
	
	$('.overlay-trigger').click(overlay);
	$('.disagree').click(disagree);
	$('#download').click(agree);
	$('#overlay, .close').click(disagree);
	$('#agreementCheckbox').change(toggleCheckbox);
});

function overlay(obj) {
	obj.preventDefault();
	
	if(checkbox.checked) {
		agree();
	} else {
		topOffset = -$(document).scrollTop();
		$('#overlay, #overlay-content').removeClass('hidden');
		$('html').css('top', topOffset + 'px').addClass('noscroll');
	}
}

function close() {
	$('#overlay, #overlay-content').addClass('hidden');
	setTimeout(function() {
		$('html').removeClass('noscroll');
		$('html,body').scrollTop(-topOffset);
	}, 300);
}

function toggleCheckbox() {
	$('#download').prop('disabled', !checkbox.checked);
}

function agree() {
	if(href) {
		document.location = href;
	}
	close();
}

function disagree() {
	checkbox.checked = false;
	toggleCheckbox();
	close();
}
