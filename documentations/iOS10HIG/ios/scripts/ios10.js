$(document).ready(function() {
	$('body').removeClass('nojs');

	$(window).scroll( function(){

		$('.section-reveal').each( function(i){

			var objectEnd = $(this).offset().top + ( $(this).outerHeight() / 6 );

			var windowEnd = $(window).scrollTop() + $(window).height();

			if( windowEnd > objectEnd ){

					$(this).addClass('show');

			}

		});

	});

});
