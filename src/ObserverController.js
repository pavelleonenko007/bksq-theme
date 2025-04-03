export class ObserverController {
	/**
	 * @type {Map<string, IntersectionObserver>}
	 */
	static observerMap = new Map();

	static init() {
		const observerCallbacks = {
			'.scrollobs': (entries, observer) => {
				entries.forEach(async (entry) => {
					if (entry.isIntersecting) {
						$(entry.target).addClass('visible');
					} else {
					}
				});
			},
			'.scrollobs-line': (entries, observer) => {
				entries.forEach(async (entry) => {
					if (entry.isIntersecting) {
						$(entry.target).addClass('visible');
					} else {
					}
				});
			},
			'.scrollobs-opc': (entries, observer) => {
				entries.forEach(async (entry) => {
					if (entry.isIntersecting) {
						$(entry.target).addClass('visible');
					} else {
					}
				});
			},
		};

		for (const selector in observerCallbacks) {
			if (Object.prototype.hasOwnProperty.call(observerCallbacks, selector)) {
				const callback = observerCallbacks[selector];
				const observer = new IntersectionObserver(callback, {
					threshold: 0,
				});

				document.querySelectorAll(selector).forEach((element) => {
					observer.observe(element);
				});

				ObserverController.observerMap.set(selector, observer);
			}
		}
	}

	static disconnectAll() {
		ObserverController.observerMap.forEach((observer) => observer.disconnect());
		ObserverController.observerMap.clear();
	}
}

// document.querySelectorAll('.scrollobs').forEach((trigger) => {
// 	new IntersectionObserver(
// 		(entries, observer) => {
// 			entries.forEach(async (entry) => {
// 				if (entry.isIntersecting) {
// 					$(entry.target).addClass('visible');
// 				} else {
// 				}
// 			});
// 		},
// 		{
// 			threshold: 0,
// 		}
// 	).observe(trigger);
// });

// document.querySelectorAll('.scrollobs-line').forEach((trigger) => {
// 	new IntersectionObserver(
// 		(entries, observer) => {
// 			entries.forEach(async (entry) => {
// 				if (entry.isIntersecting) {
// 					$(entry.target).addClass('visible');
// 				} else {
// 				}
// 			});
// 		},
// 		{
// 			threshold: 0,
// 		}
// 	).observe(trigger);
// });

// document.querySelectorAll('.scrollobs-opc').forEach((trigger) => {
// 	new IntersectionObserver(
// 		(entries, observer) => {
// 			entries.forEach(async (entry) => {
// 				if (entry.isIntersecting) {
// 					$(entry.target).addClass('visible');
// 				} else {
// 				}
// 			});
// 		},
// 		{
// 			threshold: 0,
// 		}
// 	).observe(trigger);
// });
