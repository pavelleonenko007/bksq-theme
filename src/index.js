import { AfishaFilterForm } from './AfishaFilterForm';
import YandexMap from './AfishaMap';
import { initCustomDatePicker } from './CustomDatepicker';
import { initCustomSelectComponents } from './CustomSelect';
import { initLoadMorePassedEventsButtons } from './LoadMorePassedEventsButton';
import './styles/index.scss';

initCustomDatePicker();
initCustomSelectComponents();

// const map = new YandexMap(document.querySelector('[data-js-yandex-map]'));

let map = null;

new AfishaFilterForm(map);

initLoadMorePassedEventsButtons();
