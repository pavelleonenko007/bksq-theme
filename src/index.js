import { AfishaFilterForm } from './AfishaFilterForm';
import YandexMap from './AfishaMap';
import { initCustomDatePicker } from './CustomDatepicker';
import { initCustomSelectComponents } from './CustomSelect';
import './styles/index.scss';

initCustomDatePicker();
initCustomSelectComponents();

const map = new YandexMap(document.querySelector('[data-js-yandex-map]'));

new AfishaFilterForm(map);
