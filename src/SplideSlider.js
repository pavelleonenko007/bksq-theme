import Splide from '@splidejs/splide';

export const initSplideSliders = () => {
	document.querySelectorAll('.slider').forEach((swiperElement) => {
		var splide = new Splide(swiperElement, {
			// 		type: 'loop',
			perMove: 1,
			perPage: 2.5,
			pagination: false,
			arrows: false,
			focus: 'left',
			speed: 400,
			//	trimSpace: false,
			wheelMinThreshold: 50,
			releaseWheel: true,
			wheelSleep: 500,
			wheel: true,
			autoplay: false,
			drag: true,
			interval: 2000,
			// wheel: true,
			// waitForTransition: true,
			// 		direction: 'ltr',
			breakpoints: {
				991: {},
				767: { perPage: 1 },
			},
		});

		splide.mount();
	});

	// document.querySelectorAll('.slider-loop').forEach((swiperElement2) => {
	// 	var splide = new Splide(swiperElement2, {
	// 		// 		type: 'loop',
	// 		perMove: 1,
	// 		perPage: 1.2,
	// 		wheelMinThreshold: 50,
	// 		releaseWheel: true,
	// 		wheelSleep: 500,
	// 		wheel: true,
	// 		pagination: false,
	// 		wheel: true,
	// 		arrows: false,
	// 		focus: 'сenter',
	// 		speed: 500,
	// 		autoplay: false,
	// 		drag: true,
	// 		interval: 2000,
	// 		focus: 'center',
	// 		// wheel: true,
	// 		// waitForTransition: true,
	// 		direction: 'ltr',
	// 		breakpoints: {
	// 			991: {},
	// 			767: { perPage: 1 },
	// 		},
	// 	});

	// 	// 	 var bar    = splide.root.querySelector( '.my-carousel-progress-bar' );
	// 	splide.on('mounted move', function () {
	// 		console.log('dsds');
	// 		var end = splide.Components.Controller.getEnd() + 1;
	// 		var rate = Math.min((splide.index + 1) / end, 1);
	// 		var progggg = String(100 * rate) + '%';
	// 		console.log(progggg);
	// 		$('.my-slider-progress-bar').css('width', progggg);
	// 		// bar.style.width = String( 100 * rate ) + '%';
	// 	});

	// 	splide.mount();
	// });
};
