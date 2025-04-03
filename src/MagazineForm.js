import { Validator } from './Validator';

export function initMagazineForms() {
	const MAGAZINE_FORM_SELECTOR = '.mag-form';
	const FIELD_CONTAINER_SELECTOR = '.form-field-wrap';
	const INVALID_FIELD_SELECTOR = '.form-field-wrap--invalid';

	$(document.body).append(
		`<style>${INVALID_FIELD_SELECTOR} { color: red; }</style>`
	);

	$(MAGAZINE_FORM_SELECTOR).each(function () {
		const $form = $(this);
		const $requiredFields = $form.find('[required]');

		$requiredFields.on('input', function () {
			$(this.closest(FIELD_CONTAINER_SELECTOR)).removeClass(
				INVALID_FIELD_SELECTOR.replace('.', '')
			);
		});

		function validateField($field) {
			let isValid = true;
			const type = $field.attr('type');

			switch (type) {
				case 'checkbox':
				case 'radio':
					isValid = Validator.isChecked($field);
					break;
				case 'email':
					isValid = Validator.isValidEmail($field.val());
					break;
				case 'tel':
					isValid = Validator.isValidPhone($field.val());
					break;
				default:
					isValid = !Validator.isEmpty($field);
					break;
			}

			return isValid;
		}

		$requiredFields.on('change', function () {
			let isValid = validateField($(this));

			$(this)
				.closest(FIELD_CONTAINER_SELECTOR)
				.toggleClass(INVALID_FIELD_SELECTOR.replace('.', ''), !isValid);
		});

		$form.on('submit', function (e) {
			let isValid = true;

			const requiredFieldsArray = $requiredFields.toArray();

			for (let i = 0; i < requiredFieldsArray.length; i++) {
				const $field = $(requiredFieldsArray[i]);
				isValid = validateField($field);

				if (!isValid) {
					break;
				}

				$field
					.closest(FIELD_CONTAINER_SELECTOR)
					.toggleClass(INVALID_FIELD_SELECTOR.replace('.', ''), !isValid);
			}

			if (!isValid) {
				return false;
			}
		});

		$form.attr('novalidate', 'true');
		// $form.parent().removeClass('w-form');
	});
}
