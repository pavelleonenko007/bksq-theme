import Select2 from 'select2';

const CUSTOM_SELECT_SELECTOR = '[data-js-custom-select]';

export const initCustomSelectComponents = () => {
	const $customSelect = $(CUSTOM_SELECT_SELECTOR);

	$customSelect.select2({
		searchable: true,
	});

	$customSelect.on('select2:open', function () {
		$('.select2-dropdown').attr('data-lenis-prevent', '');
	});

	const bubbleEvent = (e) => {
		$customSelect.off('change', bubbleEvent);

		e.target.dispatchEvent(
			new Event('change', {
				bubbles: true,
			})
		);

		$customSelect.on('change', bubbleEvent);
	};

	$customSelect.on('change', bubbleEvent);

	document.addEventListener('reset', (e) => {
		$customSelect.val(null).trigger('change');
	});
};
