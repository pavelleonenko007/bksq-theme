import YandexMap from './AfishaMap';
import { lenis } from './lenis';
import { debounce, promiseWrapper } from './utils';

const ROOT_SELECTOR = '[data-js-afisha-filter-form]';

class AfishaFilterForm {
	selectors = {
		root: ROOT_SELECTOR,
		afishaContent: '[data-js-afisha-filter-form-content]',
		outOfTimeContent: '[data-js-afisha-filter-form-out-of-time-content]',
		moreButton: '[data-js-afisha-filter-form-more-button]',
		resetButton: '[data-js-afisha-filter-form-reset-button]',
		preSelectedFilterButton: '[data-js-afisha-filter-form-preselected-button]',
		emptyContent: '[data-js-afisha-filter-form-empty]',
	};

	stateSelectors = {
		isFetching: 'is-fetching',
		isDisabled: 'is-disabled',
	};

	constructor(form) {
		/**
		 * @type {HTMLFormElement}
		 */
		this.root = form;

		if (!this.root) {
			return;
		}

		this.map = new YandexMap(document.querySelector('[data-js-yandex-map]'));

		this.pageControl = this.root.page;

		this.afishaContent = document.querySelector(this.selectors.afishaContent);
		this.outOfTimeContent = document.querySelector(
			this.selectors.outOfTimeContent
		);
		this.emptyContent = document.querySelector(this.selectors.emptyContent);

		/**
		 * @type {HTMLButtonElement}
		 */
		this.moreButton = document.querySelector(this.selectors.moreButton);
		/**
		 * @type {HTMLButtonElement}
		 */
		this.resetButton = this.root.querySelector(this.selectors.resetButton);

		/**
		 * @type {NodeListOf<HTMLButtonElement>}
		 */
		this.preSelectedFilterButtons = this.root.querySelectorAll(
			this.selectors.preSelectedFilterButton
		);
		this.preSelectedFilterButtonConfigs = new Map();
		this.preSelectedFilterButtons.forEach((button) => {
			this.preSelectedFilterButtonConfigs.set(
				button,
				JSON.parse(button.dataset.jsAfishaFilterFormPreselectedButton)
			);
		});

		this.debounsedOnChange = debounce(this.onChange, 50);

		this.initialFormData = {
			date: null,
			location: null,
			'activity[]': null,
			critic: null,
		};

		this.state = this._getProxyState({
			isFindingCity: false,
			isFetching: false,
			maxPages: this.moreButton
				? parseInt(this.moreButton.dataset.maxPages)
				: 0,
			hasChanges: false,
		});

		this.updateUI();

		this.bindEvents();
	}

	getFormData() {
		console.log(this.root);
	}

	hasFormChanges() {
		const formData = new FormData(this.root);

		for (const name in this.initialFormData) {
			const value = this.initialFormData[name];

			if (formData.get(name) && value !== formData.get(name)) {
				return true;
			}
		}

		return false;
	}

	_getProxyState(initialState) {
		let isUpdating = false;
		let needsUpdate = false;

		return new Proxy(initialState, {
			get: (target, prop) => {
				return target[prop];
			},
			set: (target, prop, newValue) => {
				const currentValue = target[prop];

				target[prop] = newValue;

				if (currentValue !== newValue) {
					if (isUpdating) {
						needsUpdate = true;
					} else {
						isUpdating = true;
						this.updateUI();
						isUpdating = false;

						if (needsUpdate) {
							needsUpdate = false;
							this.updateUI();
						}
					}
				}

				return true;
			},
		});
	}

	updateUI() {
		console.log({ ...this.state }, { ...this.previousState });

		const pageValue = parseInt(this.pageControl.value);

		this.root.classList.toggle(
			this.stateSelectors.isFetching,
			this.state.isFetching
		);

		document.body.style.cursor = this.state.isFindingCity ? 'wait' : null;

		this.afishaContent
			.closest('.r-afisha')
			.classList.toggle(this.stateSelectors.isFetching, this.state.isFetching);

		if (this.moreButton) {
			this.moreButton.disabled =
				this.state.isFetching || pageValue === this.state.maxPages;

			this.moreButton.hidden = pageValue === this.state.maxPages;
		}

		// Maybe later :))
		// this.preSelectedFilterButtonsConfigs.forEach((config, button) => {
		// 	button.classList.toggle('active', )
		// 	console.log({ config, button });
		// });

		this.resetButton.disabled = !this.state.hasChanges;
		this.resetButton.hidden = !this.state.hasChanges;

		this.previousState = { ...this.state };
	}

	async fetchPosts() {
		this.state.isFetching = true;

		try {
			const formData = new FormData(this.root);
			const response = await fetch(BKSQ.AJAX_URL, {
				method: 'POST',
				body: formData,
			});

			const { success, data } = await response.json();

			console.log({ success, data });

			if (!success) {
				throw new Error(data.message);
			}

			return data;
		} catch (error) {
			throw error;
		} finally {
			this.state.isFetching = false;
		}
	}

	async getUserLocation() {
		try {
			const position = await new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject);
			});

			return position;
		} catch (error) {
			console.error(error);

			window.alert(`Ошибка при определении геопозиции: ${error}`);

			throw error;
		}
	}

	async getUserCity() {
		const { data, error } = await promiseWrapper(this.getUserLocation());

		if (error) {
			return;
		}

		this.state.isFindingCity = true;

		if (!data.coords.longitude || !data.coords.latitude) {
			throw new Error('Ошибка при опредении координат');
		}

		const coordinatesString = `${data.coords.longitude},${data.coords.latitude}`;
		const geocoderUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=4edbd054-8d5b-4022-81d1-3808d3f13102&geocode=${encodeURIComponent(
			coordinatesString
		)}&format=json`;

		try {
			const response = await fetch(geocoderUrl);

			const json = await response.json();
			const cityName =
				json.response.GeoObjectCollection.featureMember[0].GeoObject
					.metaDataProperty.GeocoderMetaData.AddressDetails.Country
					.AdministrativeArea.AdministrativeAreaName;

			return cityName;
		} catch (error) {
			console.error(error);
			throw error;
		} finally {
			this.state.isFindingCity = false;
		}
	}

	/**
	 *
	 * @param {string} error
	 */
	showError(error) {
		console.error(error);
	}

	scrollToTopOfAfisha() {
		const afishaElement = document.querySelector('.r-afisha');
		if (afishaElement && lenis.actualScroll > afishaElement.offsetTop) {
			lenis.scrollTo(afishaElement, {
				duration: 1,
			});
		}
	}

	/**
	 *
	 * @param {Event} event
	 */
	onChange = async (event) => {
		this.map.setLocation(this.root.location.value);

		this.state.hasChanges = this.hasFormChanges();

		if (event.target !== this.pageControl) {
			this.pageControl.value = 1;
			this.scrollToTopOfAfisha();
		}

		const { data, error } = await promiseWrapper(this.fetchPosts());

		if (error) {
			this.showError(error);

			return;
		}

		if (this.map) {
			const newMarkers = BKSQ.LOCATIONS.filter((location) =>
				data.all_events.includes(location.id)
			);
			this.map.setMarkers(newMarkers);
		}

		if (data.page === 1) {
			this.afishaContent.innerHTML = data.content;
		} else {
			this.afishaContent.innerHTML += data.content;
		}

		this.outOfTimeContent.innerHTML = data.outOfTimeContent;

		if (!data.content && !data.outOfTimeContent) {
			this.emptyContent.style.display = 'flex';
		} else {
			this.emptyContent.style.display = null;
		}

		if (data.maxPages) {
			this.state.maxPages = parseInt(data.maxPages);
		}
	};

	/**
	 *
	 * @param {PointerEvent} event
	 */
	onMoreButtonClick = (event) => {
		event.preventDefault();
		event.stopPropagation();

		this.pageControl.value = parseInt(this.pageControl.value) + 1;

		this.pageControl.dispatchEvent(
			new Event('change', {
				bubbles: true,
			})
		);
	};

	/**
	 *
	 * @param {PointerEvent} event
	 */
	onPreSelectedButtonClick = async (event) => {
		event.preventDefault();
		event.stopPropagation();

		const button = event.target.closest('button');
		const isActive = !button.classList.contains('active');
		const config = JSON.parse(
			button.dataset.jsAfishaFilterFormPreselectedButton
		);
		const targetControl = this.root.querySelector(config.controlSelector);

		button.classList.toggle('active', isActive);

		this.preSelectedFilterButtonConfigs.forEach((conf, buttonElement) => {
			if (
				conf.controlSelector === config.controlSelector &&
				buttonElement !== button
			) {
				buttonElement.classList.remove('active');
			}
		});

		let value = '';

		if (isActive) {
			if (config.action) {
				const { data, error } = await promiseWrapper(this[config.action]());

				if (error) {
					return;
				}
				value = data;
			} else {
				value = config.value;
			}
		}

		// if (config.value) {
		// 	if (targetControl.type.includes('select')) {
		// 		Array.from(targetControl.options).forEach((option) => {
		// 			option.selected = option.value === config.value;
		// 		});
		// 	} else {
		// 		targetControl.value = config.value;
		// 	}

		// 	// $(targetControl).trigger('change');
		// 	targetControl.dispatchEvent(
		// 		new Event('change', {
		// 			bubbles: true,
		// 		})
		// 	);

		// 	return;
		// }

		if (targetControl.type.includes('select')) {
			if (targetControl.name === 'location') {
				const targetOption = [...targetControl.options].find(
					(option) => option.value === value
				);

				if (targetOption) {
					targetOption.selected = true;
				} else {
					const newOption = new Option(value, value, true, true);
					$(targetControl).append(newOption);
				}
			} else {
				Array.from(targetControl.options).forEach((option) => {
					option.selected = option.value === value;
				});
			}
		} else {
			targetControl.value = value;
		}

		if (targetControl.name === 'date') {
			const calendar = targetControl._flatpickr;

			if (value !== 'Вечное') {
				calendar.setDate(value, false);
				calendar.close();
			} else {
				calendar.input.value = value;
				calendar._input.value = value;
			}
		}

		targetControl.dispatchEvent(
			new Event('change', {
				bubbles: true,
			})
		);
	};

	/**
	 *
	 * @param {Event} event
	 */
	onReset = (event) => {
		this.preSelectedFilterButtons.forEach((button) => {
			button.classList.remove('active');
		});

		for (const name in this.initialFormData) {
			const value = this.initialFormData[name];

			this.root[name].value = value;
		}

		const datepicker = this.root?.date?._flatpickr;

		datepicker?.clear();
		datepicker?.close();

		this.root.dispatchEvent(
			new Event('change', {
				bubbles: true,
			})
		);
	};

	bindEvents() {
		this.root.addEventListener('change', this.debounsedOnChange);
		this.root.addEventListener('reset', this.onReset);
		if (this.moreButton) {
			this.moreButton.addEventListener('click', this.onMoreButtonClick);
		}

		this.preSelectedFilterButtons.forEach((button) => {
			button.addEventListener('click', this.onPreSelectedButtonClick);
		});
	}

	destroy() {
		this.root.removeEventListener('change', this.debounsedOnChange);
		this.root.removeEventListener('reset', this.onReset);
		if (this.moreButton) {
			this.moreButton.removeEventListener('click', this.onMoreButtonClick);
		}

		this.preSelectedFilterButtons.forEach((button) => {
			button.removeEventListener('click', this.onPreSelectedButtonClick);
		});

		this.map.destroy();
	}
}

export default class AfishaFilterFormCollection {
	/**
	 * @type {Map<HTMLFormElement, AfishaFilterForm>}
	 */
	static afishaFilterForms = new Map();

	static init() {
		document.querySelectorAll(ROOT_SELECTOR).forEach((form) => {
			const AfishaFilterFormInstance = new AfishaFilterForm(form);

			AfishaFilterFormCollection.afishaFilterForms.set(
				form,
				AfishaFilterFormInstance
			);
		});
	}

	static destroyAll() {
		AfishaFilterFormCollection.afishaFilterForms.forEach((formInstance) => {
			formInstance.destroy();
		});
	}
}
