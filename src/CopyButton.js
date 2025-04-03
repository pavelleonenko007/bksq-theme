const ROOT_SELECTOR = '[data-js-copy-button]';

export class CopyButton {
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

			const copyText = button.dataset.copyText;

			navigator.clipboard
				.writeText(copyText)
				.then(() => {
					console.log('Text copied to clipboard');
				})
				.catch((err) => {
					console.error('Failed to copy text: ', err);
				});
		});
	}
}
