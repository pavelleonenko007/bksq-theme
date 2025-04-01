import { promiseWrapper } from './utils';

const ROOT_SELECTOR = '[data-js-load-more-passed-events]';

export const initLoadMorePassedEventsButtons = () => {
	document.querySelectorAll(ROOT_SELECTOR).forEach((button) => {
		console.log(button);

		/**
		 *
		 * @param {PointerEvent} event
		 */
		button.onclick = async (event) => {
			event.preventDefault();
			event.stopPropagation();

			try {
				const formData = new FormData();
				const page = parseInt(button.dataset.page) + 1;

				formData.append('action', 'load_more_passed_events');
				formData.append('page', page);
				formData.append('nonce', button.dataset.nonce);

				const response = await fetch(BKSQ.AJAX_URL, {
					method: 'POST',
					body: formData,
				});

				const { success, data } = await response.json();

				console.log({ success, data });

				if (!success) {
					console.error(data.message);
					return;
				}

				document.querySelector(button.dataset.outputSelector).innerHTML +=
					data.html;

				if (data.page >= parseInt(button.dataset.maxPages)) {
					button.disabled = true;
					button.hidden = true;
				}
			} catch (error) {
				console.error(error);
			}
		};
	});
};
