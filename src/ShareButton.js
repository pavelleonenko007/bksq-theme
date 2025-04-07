const ROOT_SELECTOR = '[data-js-share-button]';

export class ShareButton {
	selectors = {
		root: ROOT_SELECTOR,
	};

	/**
	 *
	 * @param {HTMLElement} element
	 */
	constructor(element) {
		this.root = element;

		this.bindEvents();
	}

	bindEvents() {
		document.addEventListener('click', (event) => {
			const button = event.target.closest(this.selectors.root);
			if (!button) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();

			if (navigator.share) {
				navigator.share({
					title: button.dataset.title,
					url: button.dataset.url,
				});
			}
		});
	}
}
