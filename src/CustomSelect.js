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
			searchable: true,
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
		$('.select2-search__field').attr('placeholder', 'Поиск');
	};

	onChangeBubble = (event) => {
		this.$customSelect.off('change', this.onChangeBubble);

		event.target.dispatchEvent(
			new Event('change', {
				bubbles: true,
			})
		);

		this.$customSelect.on('change', this.onChangeBubble);
	};

	onReset = () => {
		this.$customSelect.val(null).trigger('change');
	};

	bindEvents() {
		document.addEventListener('reset', this.onReset);
		this.$customSelect.on('change', this.onChangeBubble);
		this.$customSelect.on('select2:open', this.onOpen);
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
