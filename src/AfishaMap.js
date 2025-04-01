import * as ymaps3 from 'ymaps3';
import { customization } from './mapCustomizationConfig';

const ROOT_SELECTOR = '[data-js-yandex-map]';

export default class YandexMap {
	selectors = {
		root: ROOT_SELECTOR,
	};

	stateSelectors = {
		isActive: 'is-active',
		isDisabled: 'is-disabled',
	};

	/**
	 *
	 * @param {HTMLElement} mapContainer
	 */
	constructor(mapContainer) {
		this.container = mapContainer;
		this.selectedCity = 'Москва';

		this.selectedLocations = [];

		this.initMap();
	}

	async initMap() {
		// Дождитесь резолва`ymaps3.ready`
		await ymaps3.ready;

		const {
			YMapComplexEntity,
			YMap,
			YMapDefaultSchemeLayer,
			YMapDefaultFeaturesLayer,
			YMapMarker,
		} = ymaps3;

		this.ymaps = ymaps3;

		// Карта инициализируется в первом контейнере
		this.map = new YMap(this.container, {
			behaviors: ['drag', 'pinchZoom', 'mouseTilt', 'dblClick'],
			location: {
				center: [37.6156, 55.7522],
				zoom: 12,
			},
		});

		this.map.addChild(
			new YMapDefaultSchemeLayer({
				customization,
				theme: 'dark',
			})
		);
		this.map.addChild(new YMapDefaultFeaturesLayer({}));

		this.setLocation();
		this.setMarkers(BKSQ.LOCATIONS);
	}

	async setLocation(city) {
		if (!city) {
			city = 'Москва';
		}

		if (this.selectedCity === city) {
			return;
		}

		const response = await fetch(
			`https://geocode-maps.yandex.ru/1.x/?apikey=4edbd054-8d5b-4022-81d1-3808d3f13102&geocode=${encodeURIComponent(
				city
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

		this.map.setLocation({
			center: coordinates,
			zoom: 12,
		});

		this.selectedCity = city;
	}

	setMarkers(locations = []) {
		const { YMapComplexEntity, YMapMarker } = this.ymaps;
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

				if (this._props.icon) {
					element.style.backgroundImage = `url(${this._props.icon})`;
					element.style.backgroundSize = 'contain';
					element.style.backgroundRepeat = 'no-repeat';
				}

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
				element.className = 'popup popup--afisha';

				const dateElement = document.createElement('div');
				dateElement.className = 'popup__date';
				dateElement.innerHTML = this._props.date;

				const headerElement = document.createElement('header');
				headerElement.className = 'popup__header';
				headerElement.textContent = this._props.title;

				const bodyElement = document.createElement('div');
				bodyElement.className = 'popup__body';
				bodyElement.innerHTML = this._props.address;

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

				element.append(dateElement, headerElement, bodyElement);

				document.body.addEventListener(
					'click',
					this._closePopupBodyClickHandler
				);

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

		this.selectedLocations.forEach((location) => {
			this.map.removeChild(location);
		});

		this.selectedLocations = locations.map((location) => {
			return new CustomMarkerWithPopup(location);
		});

		this.selectedLocations.forEach((loc) => {
			this.map.addChild(loc);
		});
	}
}
