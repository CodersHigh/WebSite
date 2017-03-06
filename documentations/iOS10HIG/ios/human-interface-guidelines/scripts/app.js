var lastId,
		menuItems,
		scrollItems;

$(document).ready(function() {

	navElement = '.nav-' + $('body').attr('id');
	subNavElement = '.nav-' + $('body').attr('class');

	$(navElement).addClass('open');
	$(subNavElement).addClass('selected');

	var nav = $("#doc-nav li ul.sub-side"),
			menuItems = nav.find("li a");

	scrollItems = menuItems.map(function(){

		var item = $($(this).attr("href"));

		if (item.length) { return item; }

	});


	var sideNav = $('#doc-nav'); // Side Navigation
	var sideNavWidth = sideNav.width(); // Width of Side Navigation
	var openNav = $('#doc-nav .open'); // Current Open Navigation Section (or Current Page)
	var navHeight = sideNav.height() + 36; // Side Navigation height plus some padding
	var routerOffset = $('#router').offset().top; // Y Position of the Router Element that stops navigation from being fixed
	var navOffset = sideNav.offset().top; // Y Position of the Side Navigation
	var openNavOffset = openNav.offset().top - 63; // Y Position of the Open Element in the side navigation

	// Position Navigation and Highlight Section in view when Window Scrolls

	$(window).resize(function() {

		var width = $(document).width();
		if (width > 1023) {
			sideNavWidth = sideNav.width(); // Width of Side Navigation
			navHeight = sideNav.height() + 36; // Side Navigation height plus some padding
			navOffset = sideNav.offset().top; // Y Position of the Side Navigation
			openNavOffset = openNav.offset().top - 63; // Y Position of the Open Element in the side navigation
		}
	});

	$(window).scroll(function(){

		routerOffset = $('#router').offset().top;

		var fromTop = $(this).scrollTop();

		// Get id of current scroll item
		var cur = scrollItems.map(function(){

		  if ($(this).offset().top-36 < fromTop)
		  return this;

		});


		// Get the id of the current element
		cur = cur[cur.length-1];

		var id = cur && cur.length ? cur[0].id : "";

		if (lastId !== id) {

			lastId = id;

		  // Set remove active class
		  menuItems.removeClass("active").end().find("[href=#"+id+"]").addClass("active");

		}


		if ($(window).scrollTop() >= openNavOffset && $(window).scrollTop() < routerOffset-navHeight-(navOffset-openNavOffset)) {

	    sideNav.removeAttr('style').css({

				position: 'fixed',

				top: navOffset-openNavOffset,

				width: sideNavWidth

 			});

	  } else if ($(window).scrollTop() >= routerOffset-navHeight-(navOffset-openNavOffset)) {

			sideNav.css({

				position: 'relative',

				top: routerOffset-navOffset-navHeight,

			});

		} else {

	    sideNav.removeAttr('style');
	  }

	});

	// Fade in Videos on load

	$('video').hide(0).fadeIn(500).css("display", "block");

	// Play Videos if clicked

	$('video').click(function() {
		$(this).siblings('.video-play, .video-replay, .video-frame-poster').addClass('hidden');
		$(this)[0].play();
	});

	// Play Videos with Controls

	$('.video-play, .video-replay, .video-frame-poster').click(function() {
		$(this).addClass('hidden');
		$(this).siblings('.video-frame-poster').fadeOut(50);
		$(this).siblings('video')[0].play();
	});

	$('video').bind("ended", function() {
		$(this).siblings('.video-play').hide();
		$(this).siblings('.video-replay, .video-frame-iphone6s-poster').show().css("display", "block").removeClass('hidden');
		$(this).siblings('.video-frame-poster').hide().removeClass('hidden').fadeIn(600);
	});

	// Animate Scroll to Anchor Links

	$("a[href^=#]").click(function(e) {

		e.preventDefault();

		var dest = $(this).attr('href');

		$('html,body').animate({ scrollTop: $(dest).offset().top - 64 }, 300);

	});

});


document.addEventListener('DOMContentLoaded', init, false);

var directoryNavMenu, directoryNavFooter, sectionMenuHead, sectionFooterHead;

function init() {
	directoryNavMenu = document.getElementById('directorynav-menu');
	//directoryNavFooter = document.getElementById('directorynav-footer');

	if(directoryNavMenu != null) {
		sectionMenuHead = directoryNavMenu.getElementsByTagName('h3');
		for(var i=0;i<sectionMenuHead.length;i++){
			sectionMenuHead[i].addEventListener('click',toggleFooterNav,false);
		}
	}

	/*if(directoryNavFooter != null) {
		sectionFooterHead = directoryNavFooter.getElementsByTagName('h3');
		for(var i=0;i<sectionFooterHead.length;i++){
			sectionFooterHead[i].addEventListener('click',toggleFooterNav,false);
		}
	}*/

}


function toggleFooterNav(e) {
	e.currentTarget.classList.toggle('enhance');
}
