import { promiseWrapper } from './utils';

const ROOT_SELECTOR = '[data-js-afisha-filter-form]';

export class AfishaFilterForm {
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

	constructor(map) {
		/**
		 * @type {HTMLFormElement}
		 */
		this.root = document.querySelector(this.selectors.root);

		if (!this.root) {
			return;
		}

		this.map = map;

		this.pageControl = this.root.page;

		this.afishaContent = document.querySelector(this.selectors.afishaContent);
		this.outOfTimeContent = document.querySelector(
			this.selectors.outOfTimeContent
		);
		this.emptyContent = document.querySelector(this.selectors.emptyContent);

		console.log(this.outOfTimeContent);

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

		this.initialFormData = {
			date: '',
			city: '',
			activity: '',
			page: '1',
		};

		this.state = this._getProxyState({
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

		if (this.moreButton) {
			this.moreButton.disabled =
				this.state.isFetching || pageValue === this.state.maxPages;

			this.moreButton.hidden = pageValue === this.state.maxPages;
		}

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

		console.log({ data, error });

		if (error) {
			return;
		}

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
		}
	}

	/**
	 *
	 * @param {string} error
	 */
	showError(error) {
		console.error(error);
	}

	/**
	 *
	 * @param {Event} event
	 */
	onChange = async (event) => {
		console.log(event);

		this.map.setLocation(this.root.city.value);

		this.state.hasChanges = this.hasFormChanges();

		if (event.target !== this.pageControl) {
			this.pageControl.value = 1;
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

		let value = '';

		const config = JSON.parse(
			event.target.closest('button').dataset.jsAfishaFilterFormPreselectedButton
		);
		const targetControl = this.root.querySelector(config.controlSelector);

		if (config.value) {
			if (targetControl.type.includes('select')) {
				Array.from(targetControl.options).forEach((option) => {
					option.selected = option.value === config.value;
				});
			} else {
				targetControl.value = config.value;
			}

			// $(targetControl).trigger('change');
			targetControl.dispatchEvent(
				new Event('change', {
					bubbles: true,
				})
			);

			return;
		}

		if (config.action) {
			const { data, error } = await promiseWrapper(this[config.action]());

			if (error) {
				return;
			}
			value = data;
		}

		if (value) {
			if (targetControl.type.includes('select')) {
				Array.from(targetControl.options).forEach((option) => {
					option.selected = option.value === value;
				});
			} else {
				targetControl.value = value;
			}

			// $(targetControl).trigger('change');
			targetControl.dispatchEvent(
				new Event('change', {
					bubbles: true,
				})
			);

			return;
		}

		console.log(config);
	};

	/**
	 *
	 * @param {Event} event
	 */
	onReset = (event) => {
		for (const name in this.initialFormData) {
			const value = this.initialFormData[name];

			this.root[name].value = value;
		}

		this.root.dispatchEvent(
			new Event('change', {
				bubbles: true,
			})
		);
	};

	bindEvents() {
		this.root.addEventListener('change', this.onChange);
		this.root.addEventListener('reset', this.onReset);
		if (this.moreButton) {
			this.moreButton.addEventListener('click', this.onMoreButtonClick);
		}

		this.preSelectedFilterButtons.forEach((button) => {
			button.addEventListener('click', this.onPreSelectedButtonClick);
		});
	}
}
