import Lenis from 'lenis';

export const lenis = new Lenis({
	lerp: 0.2,
	wheelMultiplier: 0.6,
	gestureOrientation: 'vertical',
	normalizeWheel: false,
	smoothTouch: false,
});

function raf(time) {
	lenis.raf(time);
	requestAnimationFrame(raf);
}

requestAnimationFrame(raf);