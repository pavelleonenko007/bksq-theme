console.log('bundle.js start');

import Barba from 'barba.js';
import AfishaFilterFormCollection from './AfishaFilterForm';
import CustomDatePickerCollection from './CustomDatepicker';
import CustomSelectCollection from './CustomSelect';
import { initLoadMorePassedEventsButtons } from './LoadMorePassedEventsButton';
import './styles/index.scss';
import { initCookies } from './acceptCookie';
import { initNumberInputs } from './NumberInput';
import { initVideos } from './videos';
import { initVladsScripts } from './VladsScripts';
import { initSplideSliders } from './SplideSlider';
import { lenis } from './lenis';
import { ObserverController } from './ObserverController';
import { initMagazineForms } from './MagazineForm';
import { initAfishaPopupStaff } from './AfishaPopupStaff';
import { initMagazineMaps } from './MagazineMap';
import BookSliderCollection from './BookSlider';
import { initFlippingBook } from './FlippingBook';
import { initMagazineMap, initMagazineYandexMap } from './MagazineYandexMap';
import { initjQueryCustomSelect } from './jQueryCustomSelect';
import { initMagazineActionSwitcher } from './MagazineActionSwitcher';

window.magazineYandexMapDestroyCallback = null;

document.addEventListener('DOMContentLoaded', function () {
	console.log('DOMContentLoaded');

	initPage();
	initHomePage();
	initAfishaPage();
	initSingleMagazinePage();

	Barba.Pjax.start();
	Barba.Prefetch.init();
	var FadeTransition = Barba.BaseTransition.extend({
		start: function () {
			this.newContainerLoading
				.then(this.perehod.bind(this))
				.then(this.fadeOut.bind(this))
				.then(this.fadeIn.bind(this));
		},
		perehod: function () {
			lenis.stop();
			$('html').addClass('perehod');
		},
		fadeOut: function () {
			return $(this.oldContainer)
				.animate({ visibility: 'visible' }, 4000)
				.promise();
		},
		fadeIn: function () {
			$(window).scrollTop(0);

			var _this = this;
			_this.done();

			$('html').removeClass('menuopened');

			$('html').addClass('perehoddone');

			setTimeout(function () {
				$('html').removeClass('perehod');
				$('html').removeClass('perehoddone');
			}, 2_000);

			Webflow.destroy();
			Webflow.ready();
			Webflow.require('ix2').init();

			lenis.start();
		},
	});

	Barba.Pjax.getTransition = function () {
		return FadeTransition;
	};

	Barba.Dispatcher.on(
		'newPageReady',
		function (currentStatus, oldStatus, container, newPageRawHTML) {
			var response = newPageRawHTML.replace(
				/(<\/?)html( .+?)?>/gi,
				'$1nothtml$2>',
				newPageRawHTML
			);
			var bodyClasses = $(response).filter('nothtml').attr('data-wf-page');
			$('html').attr('data-wf-page', bodyClasses);
		}
	);

	Barba.Dispatcher.on(
		'newPageReady',
		function (currentStatus, oldStatus, container) {
			// Найдем все скрипты на новой странице
			var scripts = container.querySelectorAll('script');

			scripts.forEach(function (script) {
				// Если у скрипта есть src, создаем новый элемент script
				if (script.src) {
					var newScript = document.createElement('script');
					newScript.src = script.src;
					document.body.appendChild(newScript);
				}
				// Для инлайновых скриптов
				else {
					eval(script.innerHTML);
				}
			});
		}
	);

	Barba.Dispatcher.on('initStateChange', () => {
		$('html').removeClass('popupopened');

		BookSliderCollection.destroyAll();
		CustomDatePickerCollection.destroyAll();
		CustomSelectCollection.destroyAll();
		AfishaFilterFormCollection.destroyAll();
		ObserverController.disconnectAll();
	});

	Barba.Dispatcher.on(
		'transitionCompleted',
		function (currentStatus, prevStatus) {
			initPage();

			const actions = {
				afisha: initAfishaPage,
				homepage: initHomePage,
				'single-magazine': initSingleMagazinePage,
			};

			actions[currentStatus.namespace]();
		}
	);
});

function initPage() {
	console.log('initPage');

	initVideos();
	initCookies();
	initLenisButtons();
	initNumberInputs();
	initVladsScripts();
	initSplideSliders();
	ObserverController.init();
	initMagazineForms();
	initSomeStaff();
}

function initSomeStaff() {
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

	//app()

	if ($('.mag-form').length) {
		const $form = $('form');
		const $submitBtn = $("input[type='submit']", $form);
		const $btnsGroup = $submitBtn.parent();

		if ($btnsGroup.children().length === 2) {
			const submitText = $submitBtn.data('wait');
			const $newSubmitBtn = $btnsGroup.find('a');

			$submitBtn.css('display', 'none');

			$newSubmitBtn.click(function (e) {
				e.preventDefault();
				$submitBtn.click();
			});

			$form.on('submit', function () {
				$newSubmitBtn.text(submitText);
			});
		}
	}

	if ($('.div-block-3').length) {
		var widthlist = $('.div-block-3').width();
		console.log(widthlist);
		var ch = widthlist.toFixed();
		console.log(ch);

		$('.hero-image-column-2.main-ggl').css('width', ch);

		$('#flipping').on('click', function () {
			$('.hero-image-column-2.main-ggl').addClass('bluere');
			setTimeout(function () {
				$('.hero-image-column-2.main-ggl').removeClass('bluere');
			}, 600);
		});
	}
}

function initLenisButtons() {
	$('[data-lenis-start]').on('click', function () {
		lenis.start();
	});
	$('[data-lenis-stop]').on('click', function () {
		lenis.stop();
	});
	$('[data-lenis-toggle]').on('click', function () {
		$(this).toggleClass('stop-scroll');
		if ($(this).hasClass('stop-scroll')) {
			lenis.stop();
		} else {
			lenis.start();
		}
	});
}

function initHomePage() {
	console.log('initHomePage');

	BookSliderCollection.init();
	initFlippingBook();
	if ($('.home-page').length) {
		// 	  $('.s7-left').find('img').attr('src', $(".s7-right").find("img").attr("src"));

		if ($('.home-page').hasClass('hp2')) {
			setTimeout(function () {
				$('html').addClass('startloaded');

				$('video').each(function () {
					$(this)[0].play();
					console.log('video');
				});
			}, 10000);

			//	$('#520b82ca-5889-57f3-7d4d-af38d7e037a1-video').removeAttr( "loop" );

			$('#fa638008-8774-3ace-e4f6-f7ea57a4cabb-video').on('ended', function () {
				// What you want to do after the event

				$('html').removeClass('startloaded');
				$('html').addClass('loaded');
				lenis.start();
			});

			$('.skip-btn').on('click', function () {
				$('html').removeClass('startloaded');
				$('html').addClass('loaded');
				lenis.start();
			});
		} else {
			function countTo100(currentCount) {
				if (currentCount < 100) {
					$('#loadertext').text(currentCount);

					setTimeout(function () {
						countTo100(currentCount + 1);
					}, 10);
				} else if (currentCount > 98) {
					$('#loadertext').text(100);
					$('html').removeClass('startloaded');
					$('html').addClass('loaded');
					lenis.start();
				} else {
					$('html').removeClass('startloaded');
					$('html').addClass('loaded');
					lenis.start();
				}
			}

			countTo100(0);
			$('html').addClass('startloaded');
		}
	} else {
		lenis.start();
	}
}

function initAfishaPage() {
	console.log('initAfishaPage');

	initLoadMorePassedEventsButtons();

	initAfishaPopupStaff();

	CustomDatePickerCollection.init();
	CustomSelectCollection.init();
	AfishaFilterFormCollection.init();
}

function initSingleMagazinePage() {
	BookSliderCollection.init();
	initMagazineMaps();
	initMagazineActionSwitcher();
	initMagazineYandexMap().then((cb) => {
		console.log({ cb });

		window.magazineYandexMapDestroyCallback = cb;
		initjQueryCustomSelect();
	});
}

// initCustomDatePicker();
// // initCustomSelectComponents();

// const map = new YandexMap(document.querySelector('[data-js-yandex-map]'));

// new AfishaFilterForm(map);

// initLoadMorePassedEventsButtons();
