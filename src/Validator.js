export class Validator {
	/**
	 * @param {string} email
	 * @returns {boolean}
	 */
	static isValidEmail(email) {
		console.log(email);

		const re =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	/**
	 * @param {string} phone
	 * @returns {boolean}
	 */
	static isValidPhone(phone) {
		const cleanedPhone = phone.replace(/[^+\d]/g, ''); // Удаляем все символы кроме цифр и плюса
		const re = /^(?:\+)?([0-9]{6,14})$/; // Допускаем наличие или отсутствие плюса в начале
		return re.test(cleanedPhone);
	}

	/**
	 * @param {HTMLInputElement} checkbox
	 * @returns {boolean}
	 */
	static isChecked(checkbox) {
		if (checkbox instanceof jQuery) {
			return checkbox.is(':checked');
		}

		return checkbox.checked;
	}

	static isEmpty(field) {
		if (field instanceof jQuery) {
			return !field.val();
		}
		return !field.value;
	}
}
