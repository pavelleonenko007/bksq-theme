import flatpickr from 'flatpickr';
import { Russian } from 'flatpickr/dist/l10n/ru.js';

const ROOT_SELECTOR = '[data-js-custom-datepicker]';

class CustomDatePicker {
	/**
	 *
	 * @param {HTMLInputElement} element
	 */
	constructor(element) {
		this.root = element;

		function extraBKSQButtons() {
			return function (fp) {
				return {
					onReady() {
						fp.calendarContainer.classList.add('bksq-calendar');
						fp.innerContainer.classList.add('bksq-calendar__inner');
						fp.monthNav.classList.add('bksq-calendar__months');
						fp.nextMonthNav.classList.add('bksq-calendar__months-next');
						fp.prevMonthNav.classList.add('bksq-calendar__months-prev');
						fp.daysContainer.classList.add('bksq-calendar__days-wrapper');
						fp.days.classList.add('bksq-calendar__days');
						fp.todayDateElem.classList.add('bksq-calendar__today');

						fp.monthElements.forEach((element) => {
							element.disabled = true;
						});

						const markup = `
						<div class="bksq-actions">
							<button 
								id="bksqCalendarApplyButton" 
								type="button" 
								class="bksq-actions__button button" 
								disabled
							>
								Выбрать
							</button>
							<button 
								id="bksqCalendarCloseButton" 
								type="button" 
								class="bksq-actions__button button button--link"
							>
								Закрыть
							</button>
							<div class="bksq-actions__separator"></div>
							<button 
								id="bksqCalendarOutOfTimeButton" 
								type="button" 
								class="bksq-actions__button button button--outline"
							>
								Вне времени и дат
							</button>
						</div>
						`;

						fp.calendarContainer.insertAdjacentHTML('beforeend', markup);

						fp.bksqApplyButton = fp.calendarContainer.querySelector(
							'#bksqCalendarApplyButton'
						);
						fp.bksqCloseButton = fp.calendarContainer.querySelector(
							'#bksqCalendarCloseButton'
						);
						fp.bksqOutOfTimeButton = fp.calendarContainer.querySelector(
							'#bksqCalendarOutOfTimeButton'
						);

						/**
						 *
						 * @param {PointerEvent} e
						 */
						fp.bksqApplyButton.onclick = (e) => {
							e.preventDefault();
							e.stopPropagation();

							if (fp.selectedDates.length <= 0) {
								return;
							}

							fp.close();
						};

						/**
						 *
						 * @param {PointerEvent} e
						 */
						fp.bksqCloseButton.onclick = (e) => {
							e.preventDefault();
							e.stopPropagation();

							fp.close();
						};

						/**
						 *
						 * @param {PointerEvent} e
						 */
						fp.bksqOutOfTimeButton.onclick = (e) => {
							e.preventDefault();
							e.stopPropagation();

							fp._input.value = 'Вечное';
							fp.input.value = 'Вечное';

							fp.close();
						};

						fp.loadedPlugins.push('extraBKSQButtons');
					},
					onChange(selectedDates, dateStr, instance) {
						console.log({ selectedDates, dateStr, instance });

						fp.bksqApplyButton.disabled = fp.selectedDates.length <= 0;

						instance.open();
					},
				};
			};
		}

		this.customDatePicker = flatpickr(this.root, {
			altInput: true,
			mode: 'range',
			altFormat: 'F j, Y',
			enableYear: false,
			dateFormat: 'Y-m-d',
			locale: Russian,
			plugins: [new extraBKSQButtons()],
		});

		console.log(this.customDatePicker);
		
	}

	destroy() {
		this.customDatePicker.destroy();
	}
}

export default class CustomDatePickerCollection {
	/**
	 * @type {Map<HTMLInputElement, CustomDatePicker>}
	 */
	static customDatePickerMap = new Map();

	static init() {
		document.querySelectorAll(ROOT_SELECTOR).forEach((input) => {
			const CustomDatePickerInstance = new CustomDatePicker(input);
			CustomDatePickerCollection.customDatePickerMap.set(
				input,
				CustomDatePickerInstance
			);
		});
	}

	static destroyAll() {
		CustomDatePickerCollection.customDatePickerMap.forEach((datePicker) => {
			datePicker.destroy();
		});
		CustomDatePickerCollection.customDatePickerMap.clear();
	}
}

// export const initCustomDatePicker = () => {
// 	const dateControl = document.getElementById('afishaFilterFormDateControl');

// 	if (dateControl) {
// 		function extraBKSQButtons() {
// 			return function (fp) {
// 				return {
// 					onReady() {
// 						console.log(fp);

// 						fp.calendarContainer.classList.add('bksq-calendar');
// 						fp.innerContainer.classList.add('bksq-calendar__inner');
// 						fp.monthNav.classList.add('bksq-calendar__months');
// 						fp.nextMonthNav.classList.add('bksq-calendar__months-next');
// 						fp.prevMonthNav.classList.add('bksq-calendar__months-prev');
// 						fp.daysContainer.classList.add('bksq-calendar__days-wrapper');
// 						fp.days.classList.add('bksq-calendar__days');
// 						fp.todayDateElem.classList.add('bksq-calendar__today');

// 						fp.monthElements.forEach((element) => {
// 							element.disabled = true;
// 						});

// 						const markup = `
// 						<div class="bksq-actions">
// 							<button 
// 								id="bksqCalendarApplyButton" 
// 								type="button" 
// 								class="bksq-actions__button button" 
// 								disabled
// 							>
// 								Выбрать
// 							</button>
// 							<button 
// 								id="bksqCalendarCloseButton" 
// 								type="button" 
// 								class="bksq-actions__button button button--link"
// 							>
// 								Закрыть
// 							</button>
// 							<div class="bksq-actions__separator"></div>
// 							<button 
// 								id="bksqCalendarOutOfTimeButton" 
// 								type="button" 
// 								class="bksq-actions__button button button--outline"
// 							>
// 								Вне времени и дат
// 							</button>
// 						</div>
// 						`;

// 						fp.calendarContainer.insertAdjacentHTML('beforeend', markup);

// 						fp.bksqApplyButton = fp.calendarContainer.querySelector(
// 							'#bksqCalendarApplyButton'
// 						);
// 						fp.bksqCloseButton = fp.calendarContainer.querySelector(
// 							'#bksqCalendarCloseButton'
// 						);
// 						fp.bksqOutOfTimeButton = fp.calendarContainer.querySelector(
// 							'#bksqCalendarOutOfTimeButton'
// 						);

// 						/**
// 						 *
// 						 * @param {PointerEvent} e
// 						 */
// 						fp.bksqApplyButton.onclick = (e) => {
// 							e.preventDefault();
// 							e.stopPropagation();

// 							if (fp.selectedDates.length <= 0) {
// 								return;
// 							}

// 							fp.close();
// 						};

// 						/**
// 						 *
// 						 * @param {PointerEvent} e
// 						 */
// 						fp.bksqCloseButton.onclick = (e) => {
// 							e.preventDefault();
// 							e.stopPropagation();

// 							fp.close();
// 						};

// 						/**
// 						 *
// 						 * @param {PointerEvent} e
// 						 */
// 						fp.bksqOutOfTimeButton.onclick = (e) => {
// 							e.preventDefault();
// 							e.stopPropagation();

// 							fp._input.value = 'Вечное';
// 							fp.input.value = 'Вечное';

// 							fp.close();
// 						};

// 						// const id = fp.input.id;

// 						// if (!id) {
// 						// 	return;
// 						// }

// 						// if (fp.mobileInput) {
// 						// 	fp.input.removeAttribute('id');
// 						// 	fp.mobileInput.id = id;
// 						// } else if (fp.altInput) {
// 						// 	fp.input.removeAttribute('id');
// 						// 	fp.altInput.id = id;
// 						// }

// 						fp.loadedPlugins.push('extraBKSQButtons');
// 					},
// 					onChange(selectedDates, dateStr, instance) {
// 						console.log({ selectedDates, dateStr, instance });

// 						fp.bksqApplyButton.disabled = fp.selectedDates.length <= 0;

// 						instance.open();
// 					},
// 				};
// 			};
// 		}

// 		const calendar = flatpickr(dateControl, {
// 			altInput: true,
// 			mode: 'range',
// 			altFormat: 'F j, Y',
// 			enableYear: false,
// 			dateFormat: 'Y-m-d',
// 			locale: Russian,
// 			plugins: [new extraBKSQButtons()],
// 		});
// 	}
// };
