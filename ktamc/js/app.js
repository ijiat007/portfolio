$(document).ready(function() {
	
	// gnb
	function desektopGnb() {
		// if (window.matchMedia('(min-width: 768px)').matches) {
		if ($(window).width() >= 769) {
			$('header .gnb li').hover(
				function() {
					$(this).children("ul.snb").slideDown('fast');
			}, function() {
					$(this).children("ul.snb").slideUp('fast');
			});
		} else {
		}
	}
	var pathname = location.pathname.split( '/' );
	url = pathname[ pathname.length - 1 ];
	$('.gnb li').each(function() {
		var thisPage =  $(this).find('a').attr('href');
		if (thisPage == url) {
			$(this).addClass('active');
			$(this).parent().parent('li').addClass('active');
		}
	});

	head = function() {
		header = $('header');
		tit = header.find('h2');
		if (url == 'index') {
			$('body').attr('id', 'main');
			tit.remove();
			desektopGnb();
			$(document).load($(window).bind("resize", desektopGnb));
		}
		if (url.match('CO_')) {
			header.addClass('bg1');
		}
		if (url.match('CO_1000')) {
			tit.html('회사정보<span>company info</span>');
		}
		if (url.match('CO_1100')) {
			tit.html('연혁<span>company history</span>');
		}
		if (url.match('CO_1200')) {
			tit.html('오시는길<span>contact us</span>');
		}
		if (url.match('BU_')) {
			header.addClass('bg2');
			$('.gnb > li:eq(1)').addClass('active');
			tit.html('운용현황<span>portfolio</span>');
		}
		if (url.match('RE_')) {
			header.addClass('bg3');
			tit.html('인재채용<span>recruit</span>');
		}
		if (url.match('NT_')) {
			header.addClass('bg4');
			$('.gnb > li:eq(3)').addClass('active');
		}
		if (url.match('NT_10')) {
			tit.html('회사소식<span>news</span>');
			$('.gnb li:eq(7)').addClass('active');
		}
		if (url.match('NT_11')) {
			tit.html('공지사항<span>notice</span>');
			$('.gnb li:eq(8)').addClass('active');
		}
	}
	head();

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

	$('.btn_top').on('click', function() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	});
});