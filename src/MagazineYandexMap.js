import * as ymaps3 from 'ymaps3';
import { customization } from './mapCustomizationConfig';

export const initMagazineYandexMap = async () => {
	console.log('initMap');

	const mapContainerElement = document.getElementById('map');

	if (!mapContainerElement) {
		return null;
	}

	await ymaps3.ready;

	const {
		YMapComplexEntity,
		YMap,
		YMapDefaultSchemeLayer,
		YMapDefaultFeaturesLayer,
		YMapMarker,
	} = ymaps3;

	const map = new YMap(mapContainerElement, {
		behaviors: ['drag', 'pinchZoom', 'mouseTilt', 'dblClick'],
		location: {
			center: [37.588144, 55.733842],
			zoom: 10,
		},
	});
	const form = document.querySelector('.filter-form');
	let state = {};
	let selectedLocations = [];
	const setupCities = () => {
		const citySelect = document.querySelector('select[name="city"]');
		const cities = [...new Set(window.locations.map((loc) => loc.city))];
		const cityOptions = cities.map((city) => {
			const option = document.createElement('option');

			option.value = city;

			option.textContent = city;

			return option;
		});

		cityOptions.forEach((option) => {
			citySelect.append(option);
		});
	};
	const setupLocations = async () => {
		if (selectedLocations.length > 0) {
			selectedLocations.forEach((loc) => {
				map.removeChild(loc);
			});
		}

		const newState = Object.fromEntries(new FormData(form).entries());

		if (state.city !== newState.city) {
			const response = await fetch(
				`https://geocode-maps.yandex.ru/1.x/?apikey=4edbd054-8d5b-4022-81d1-3808d3f13102&geocode=${encodeURIComponent(
					newState.city
				)}&format=json`
			);

			const json = await response.json();

			if (json.response.GeoObjectCollection.featureMember.length === 0) {
				throw new Error('City not found');
			}

			const coordinates =
				json.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
					.split(' ')
					.map(Number);

			map.setLocation({
				center: coordinates,
				zoom: 12,
			});
		}

		selectedLocations = window.locations.filter((loc) => {
			const isSameCity = loc.city === newState.city;
			return isSameCity && loc.categories.includes(newState.switcher);
		});

		selectedLocations = selectedLocations.map((loc) => {
			return new CustomMarkerWithPopup(loc);
		});

		selectedLocations.forEach((loc) => {
			map.addChild(loc);
		});

		state = newState;
	};

	setupCities();
	map.addChild(
		new YMapDefaultSchemeLayer({
			customization,
			theme: 'dark',
		})
	);
	map.addChild(new YMapDefaultFeaturesLayer({}));

	form.onchange = setupLocations;

	setupLocations();

	class CustomMarkerWithPopup extends YMapComplexEntity {
		constructor(options) {
			super(options);
			this._marker = null;
			this._popup = null;

			this._closePopupBodyClickHandler =
				this._closePopupBodyClickHandler.bind(this);
		}

		// Handler for attaching the control to the map
		_onAttach() {
			this._createMarker();
		}
		// Handler for detaching control from the map
		_onDetach() {
			this._marker = null;
			document.body.removeEventListener(
				'click',
				this._closePopupBodyClickHandler
			);
		}
		// Handler for updating marker properties
		_onUpdate(props) {
			if (props.zIndex !== undefined) {
				this._marker?.update({ zIndex: props.zIndex });
			}
			if (props.coordinates !== undefined) {
				this._marker?.update({ coordinates: props.coordinates });
			}
		}
		// Method for creating a marker element
		_createMarker() {
			const element = document.createElement('div');
			element.className = 'marker';
			element.onclick = () => {
				this._openPopup();
				map.setLocation({
					center: this._props.coordinates,
					duration: 800,
				});
			};

			this._marker = new YMapMarker(
				{ coordinates: this._props.coordinates },
				element
			);

			this.addChild(this._marker);
		}

		_closePopupBodyClickHandler(event) {
			if (
				!event.target.closest('.popup') &&
				event.target !== this._marker.element
			) {
				this._closePopup();
			}
		}

		// Method for creating a popup window element
		_openPopup() {
			if (this._popup) {
				return;
			}

			this._marker.element.classList.add('marker--selected');

			const element = document.createElement('div');
			element.className = 'popup';

			const headerElement = document.createElement('header');
			headerElement.className = 'popup__header';
			headerElement.textContent = this._props.title;

			const bodyElement = document.createElement('div');
			bodyElement.className = 'popup__body';
			bodyElement.textContent = this._props.address;

			if (this._props.linkToShop) {
				const separatorElement = document.createElement('div');
				separatorElement.className = 'popup__separator';
				bodyElement.append(separatorElement);

				const linkElement = document.createElement('a');
				linkElement.className = 'popup__link';
				linkElement.href = this._props.linkToShop;
				linkElement.textContent = 'Купить онлайн';
				linkElement.target = '_blank';
				bodyElement.append(linkElement);
			}

			if (this._props.additionalInfo) {
				const additionalInfoElement = document.createElement('div');
				additionalInfoElement.className = 'popup__additional-info';
				additionalInfoElement.textContent = this._props.additionalInfo;
				bodyElement.append(additionalInfoElement);
			}

			// const closeBtn = document.createElement('button');
			// closeBtn.className = 'popup__close';
			// closeBtn.textContent = 'Close Popup';
			// closeBtn.onclick = () => this._closePopup();

			element.append(headerElement, bodyElement);

			document.body.addEventListener('click', this._closePopupBodyClickHandler);

			const zIndex =
				(this._props.zIndex ?? YMapMarker.defaultProps.zIndex) + 1_000;
			this._popup = new YMapMarker(
				{
					coordinates: this._props.coordinates,
					zIndex,
					// This allows you to scroll over popup
					blockBehaviors: this._props.blockBehaviors,
				},
				element
			);
			this.addChild(this._popup);
		}

		_closePopup() {
			if (!this._popup) {
				return;
			}

			this.removeChild(this._popup);
			this._popup = null;
			this._marker?.element?.classList.remove('marker--selected');
		}
	}

	return () => {
		map.destroy();
	};
};
