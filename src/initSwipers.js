import Swiper from 'swiper';
import 'swiper/css';

export const initSwiperSliders = () => {
	const swiperTg = new Swiper('.swiper-tg', {
		// Optional parameters
		direction: 'horizontal',
		loop: false,
		slidesPerView: 1,
		slidesPerGroup: 1,
		freeMode: true,
		mousewheel: true,

		loop: true,
		grabCursor: true,
		centeredSlides: false,
		mousewheel: {
			forceToAxis: true,
		},
		speed: 300,
		// Responsive breakpoints
		breakpoints: {
			0: {
				/* when window >=0px - webflow mobile landscape/portriat */
				slidesPerView: 1,
				slidesPerGroup: 1,
			},
			480: {
				/* when window >=0px - webflow mobile landscape/portriat */
				slidesPerView: 1,
				slidesPerGroup: 1,
			},
			// when window width is >= 768px
			768: {
				slidesPerView: 1,
			},
			// when window width is >= 992px
			992: {
				slidesPerView: 1,
			},
		},
	});

	const swiper2 = new Swiper('.swiper-numbers', {
		navigation: {
			nextEl: '.number-next',
			prevEl: '.number-prev',
		},
		// Optional parameters
		direction: 'horizontal',
		loop: false,
		grabCursor: true,
		slidesPerView: 1,
		slidesPerGroup: 1,
		spaceBetween: 20,
		loop: true,
		centeredSlides: true,

		mousewheel: {
			forceToAxis: true,
		},
		speed: 300,
		autoplay: {
			delay: 2500,
			disableOnInteraction: false,
		},

		// Responsive breakpoints
		breakpoints: {
			0: {
				/* when window >=0px - webflow mobile landscape/portriat */
				slidesPerView: 3,
				slidesPerGroup: 1,
			},
			480: {
				/* when window >=0px - webflow mobile landscape/portriat */
				slidesPerView: 3,
				slidesPerGroup: 1,
			},
			// when window width is >= 768px
			768: {
				slidesPerView: 3,
			},
			// when window width is >= 992px
			992: {
				slidesPerView: 3,
				spaceBetween: 60,
			},
		},
	});
};
