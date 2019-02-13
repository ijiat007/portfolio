$(document).ready(function() {
	
	function desektopGnb() {
		// if (window.matchMedia('(min-width: 768px)').matches) {
		if ($(window).width() >= 769) {
			$('header .gnb li').hover(
				function() {
					$(this).addClass('active');
					$(this).children("ul.snb").slideDown('fast');
			}, function() {
					$(this).children("ul.snb").slideUp('fast');
					$(this).removeClass('active');
			});
		} else {
		}
	}

	desektopGnb();
	$(document).load($(window).bind("resize", desektopGnb));

	// $(window).bind("load resize", function() {
	// 	console.log('sdf');
	// 	if ($(window).width() >= 769) {
	// 		desektopGnb();
	// 	} else {
	// 		// preventDefault();
	// 	}
	// });


	// mobile gnb
	$('header #navOpen').on('click', function() {
		$('nav').toggleClass('show');
	});
	$('header #navClose').on('click', function() {
		$('nav').toggleClass('show');
	});
	
	// footer
	$('footer .btn_fs').on('click', function() {
		$('footer .family_site').toggleClass('on');
		$('footer .family').slideToggle(250);
	});
	$('footer .btn_x_red').on('click', function() {
		$('footer .family_site').removeClass('on');
		$('footer .family').slideUp(250);
	});

});