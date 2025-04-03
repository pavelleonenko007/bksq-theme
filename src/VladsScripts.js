export const initVladsScripts = () => {
	$('.team-tab-link').each(function () {
		var position = $(this).position();
		var left = position.left;
		$(this).attr('data-scroll', left);
	});

	if (window.innerWidth <= 475) {
		$('.left-hero-image-clone.left-col').on('click', function () {
			document.getElementsByClassName('div-block-3')[0].scrollIntoView({
				behavior: 'smooth',
			});
		});
	}

	window.addEventListener(
		'resize',
		function (event) {
			$('.team-tab-link').each(function () {
				var position = $(this).position();
				var left = position.left;
				$(this).attr('data-scroll', left);
			});
		},
		true
	);

	$('.team-tab-link').on('click', function () {
		var scroll = $(this).attr('data-scroll');
		$('.team-tabs-menu').animate({ scrollLeft: scroll }, 600);
	});

	$('.team-tab-pane.active').removeClass('active');
	$('.team-tab-pane').eq(0).addClass('active');

	$('.team-tab-link.active').removeClass('active');
	$('.team-tab-link').eq(0).addClass('active');

	$('.team-tab-link').on('click', function () {
		var index = $(this).index();
		$('.team-tab-link.active').removeClass('active');
		$(this).addClass('active');

		$('.team-tab-pane.active').removeClass('active');
		$('.team-tab-pane').eq(index).addClass('active');
	});

	$('.ms5-box').on('click', function () {
		var index = $(this).index();
		$('.popup-wrapper.mag').eq(index).addClass('active');
	});

	$('.ms4-image-box').on('click', function () {
		$('.mag5-popup-wrapper.mag').addClass('active');
	});

	$('.sw-btn').on('click', function () {
		$('.sw-btn').toggleClass('active');
		if ($(this).hasClass('map-bbtn')) {
			$('.afisha-core').addClass('showmap');
		} else {
			$('.afisha-core').removeClass('showmap');
		}
	});

	$('.close-popup').on('click', function () {
		$('.popup-wrapper.active').removeClass('active');
	});

	$('.popup-bg-overlay').on('click', function () {
		$('.popup-wrapper.active').removeClass('active');
	});

	$('.mob-btn').on('click', function () {
		$('html').toggleClass('menuopened');
	});

	$('.viewallpop').on('click', function () {
		$('.popup-wrapper.see-all-popup-wrapper').addClass('active');
	});

	$('.cons-s6-left.active').removeClass('active');
	$('.cons-s6-left').eq(0).addClass('active');

	$('.consultant-box').hover(function () {
		var index = $(this).index();
		$('.consultant-box.active').removeClass('active');
		$(this).addClass('active');

		$('.cons-s6-left.active').removeClass('active');
		$('.cons-s6-left').eq(index).addClass('active');
	});
};
