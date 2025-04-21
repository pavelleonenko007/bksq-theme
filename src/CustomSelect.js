import Select2 from 'select2';

const CUSTOM_SELECT_SELECTOR = '[data-js-custom-select]';

class CustomSelect {
	/**
	 *
	 * @param {HTMLSelectElement} element
	 */
	constructor(element) {
		this.root = element;
		this.config = {
			minimumResultsForSearch: Infinity,
			templateSelection: function (data) {
				if (!data.id) {
					return data.text; // Возвращаем текст без изменений для placeholder
				}

				// Убираем дефисы и начальные пробелы из текста
				var cleanText = data.text.replace(/^[–\s]+/, '');

				// Если нужно удалить все дефисы из названия (даже внутри слов), используйте:
				// var cleanText = data.text.replace(/–/g, '').trim();

				return cleanText;
			},
			...(element.dataset.config ? JSON.parse(element.dataset.config) : {}),
		};
		this.$customSelect = $(element);

		this.$customSelect.select2(this.config);

		this.bindEvents();
	}

	onOpen = (event) => {
		$('.select2-dropdown').attr('data-lenis-prevent', '');
		// $('.select2-search__field').attr('placeholder', 'Поиск');
	};

	onClose = (event) => {
		const $searchField = this.$customSelect
			.parent()
			.find('.select2-search__field');

		if ($searchField.length > 0) {
			$searchField[0].blur();
		}
	};

	onChangeBubble = (event) => {
		this.$customSelect.off('change', this.onChangeBubble);

		event.target.dispatchEvent(
			new Event('change', {
				bubbles: true,
			})
		);

		this.$customSelect.on('change', this.onChangeBubble);

		if (
			this.$customSelect.data('select2').options.options.multiple &&
			Array.isArray(this.$customSelect.val())
		) {
			this.$customSelect
				.parent()
				.find('.select2-search__field')
				.prop('disabled', false)
				.css('display', 'block');
		}
	};

	onReset = () => {
		this.$customSelect.val(null).trigger('change');
	};

	hideSearchOnOpenOrClose = (event) => {
		console.log('hideSearchOnOpenOrClose', event);

		if (
			this.$customSelect.data('select2').options.options.multiple &&
			Array.isArray(this.$customSelect.val()) &&
			this.config.minimumResultsForSearch === Infinity
		) {
			const $searchField = this.$customSelect
				.parent()
				.find('.select2-search__field');

			const isOpeningEvent = event.type === 'select2:opening';
			$searchField.prop('disabled', isOpeningEvent);

			$searchField[0].blur();

			if (this.$customSelect.val().length === 0) {
				$searchField.css('display', 'block');
			} else {
				$searchField.css('display', 'none');
			}
		}
	};

	bindEvents() {
		document.addEventListener('reset', this.onReset);
		this.$customSelect.on('change', this.onChangeBubble);
		this.$customSelect.on('select2:open', this.onOpen);
		this.$customSelect.on(
			'select2:opening select2:closing',
			this.hideSearchOnOpenOrClose
		);
		this.$customSelect.on('select2:close', this.onClose);
	}

	destroy() {
		this.$customSelect.select2('destroy');
		document.removeEventListener('reset', this.onReset);
	}
}

export default class CustomSelectCollection {
	/**
	 * @type {Map<HTMLSelectElement, CustomSelect>}
	 */
	static customSelectMap = new Map();

	static init() {
		document.querySelectorAll(CUSTOM_SELECT_SELECTOR).forEach((select) => {
			const CustomSelectInstance = new CustomSelect(select);

			CustomSelectCollection.customSelectMap.set(select, CustomSelectInstance);
		});
	}

	static destroyAll() {
		CustomSelectCollection.customSelectMap.forEach((CustomSelect) => {
			CustomSelect.destroy();
		});
		CustomSelectCollection.customSelectMap.clear();
	}
}

// export const initCustomSelectComponents = () => {
// 	const $customSelect = $(CUSTOM_SELECT_SELECTOR);

// 	$customSelect.select2({
// 		searchable: true,
// 	});

// 	$customSelect.on('select2:open', function () {
// 		$('.select2-dropdown').attr('data-lenis-prevent', '');
// 		$('.select2-search__field').attr('placeholder', 'Поиск');
// 	});

// 	const bubbleEvent = (e) => {
// 		$customSelect.off('change', bubbleEvent);

// 		e.target.dispatchEvent(
// 			new Event('change', {
// 				bubbles: true,
// 			})
// 		);

// 		$customSelect.on('change', bubbleEvent);
// 	};

// 	$customSelect.on('change', bubbleEvent);

// 	document.addEventListener('reset', (e) => {
// 		$customSelect.val(null).trigger('change');
// 	});
// };
