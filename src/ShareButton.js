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

		if (!navigator.share) {
			return;
		}

		this.bindEvents();
	}

	bindEvents() {
		document.addEventListener('click', (event) => {
			const button = event.target.closest(this.selectors.root);
			if (!button) {
				return;
			}

			event.preventDefault();

			navigator.share({
				title: button.dataset.title,
				url: button.dataset.url,
			});
		});
	}
}
