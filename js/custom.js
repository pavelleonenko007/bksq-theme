console.log('custom js start');

$('.w-form').removeClass("w-form");
$( "input,select" ).each(function(  ) {
  var name = $(this).data('name');
  $(this).attr('name',name)
});
$('select[name="releases"]').attr('name', 'releases[]');


class FormValidator {
	selectors = {
		form: 'form',
		field: 'input',
		errorContainer: '[data-js-form-field-error]',
	};

	errorMessages = {
		valueMissing: (field) => field.title || 'This field is required',
		patternMismatch: (field) => field.title || 'Data has not valid format',
		tooShort: (field) => field.title || 'Data is too short',
		tooLong: (field) => field.title || 'Data is too long',
	};

	constructor() {
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	init() {
		this.forms = document.querySelectorAll(this.selectors.form);
		this.forms.forEach((form) => {
			form.parentElement.classList.remove('w-form');
			form.setAttribute('novalidate', '');
			form.removeAttribute('method');
			form.removeAttribute('action');
		});

		this.bindEvents();

		return Promise.resolve();
	}

	destroy() {
		document.removeEventListener('blur', this.onBlur);
		document.removeEventListener('change', this.onChange);
		this.forms.forEach((form) => {
			form.removeEventListener('submit', this.onSubmit);
		});
	}

	manageErrors(field, errorMessages) {
		const errorContainer = field
			.closest(this.selectors.field)
			.querySelector(this.selectors.errorContainer);

		errorContainer.innerHTML = errorMessages
			.map((message) => `<span>${message}</span>`)
			.join('');
	}

	validateField(field) {
		const errors = field.validity;
		const errorMessages = [];

		Object.entries(this.errorMessages).forEach(([errorType, errorFunc]) => {
			if (errors[errorType]) {
				errorMessages.push(errorFunc(field));
			}
		});

		this.manageErrors(field, errorMessages);

		const isValid = errorMessages.length === 0;

		field.ariaInvalid = !isValid;

		return isValid;
	}

	onBlur(event) {
		const { target } = event;
		const isFormField = target.closest(this.selectors.form);
		const isRequired = target.required;

		if (isFormField && isRequired) {
			this.validateField(target);
		}
	}

	onChange(event) {
		const { target } = event;
		const isFormField = target.closest(this.selectors.form);
		const isRequired = target.required;

		if (!isFormField || !isRequired) {
			return;
		}

		const isToggleType = ['radio', 'checkbox'].includes(target.type);

		if (isToggleType) {
			this.validateField(target);
		}
	}

	onSubmit(event) {
		console.log('validation');

		const { target: form } = event;
		const isFormElement = form.matches(this.selectors.form);

		if (!isFormElement) {
			return;
		}

		const requiredFields = [...form.elements].filter(
			({ required }) => required
		);
		let isFormValid = true;
		let firstInvalidField = null;

		requiredFields.forEach((field) => {
			const isFieldValid = this.validateField(field);

			if (!isFieldValid) {
				isFormValid = false;

				if (!firstInvalidField) {
					firstInvalidField = field;
				}
			}
		});

		if (!isFormValid) {
			event.preventDefault();
			event.stopImmediatePropagation();
			firstInvalidField.focus();

			return;
		}
	}

	bindEvents() {
		document.addEventListener('blur', this.onBlur, {
			capture: true,
		});
		document.addEventListener('change', this.onChange);
		this.forms.forEach((form) => {
			form.addEventListener('submit', this.onSubmit);
			
		});
	}
}

function initForms() {
	const contactForms = document.querySelectorAll('.mag-form');

	contactForms.forEach((form) => {
		const successMessageNode = form.parentElement.querySelector(
			'.w-form-done'
		);
		const errorMessageNode = form.parentElement.querySelector(
			'.w-form-error'
		);
		const submitButton = form.querySelector('[type="submit"]');
		const submitButtonValue = submitButton.value;
		
		

		form.addEventListener('submit', (event) => {
			event.preventDefault();

			submitButton.value = 'Отправка...';
			submitButton.disabled = true;

			const formData = new FormData(form);

			formData.append('action', 'submit_contact_form');

			fetch(`${window.location.origin}/wp-admin/admin-ajax.php`, {
				method: 'POST',
				body: formData,
			})
				.then((response) => response.json())
				.then(({ success, data }) => {
					console.log({ success, data });
$('.mag-form')[0].reset();
					if (!success) {
						throw new Error(data.message);
					}

					form.style.display = 'none';
					successMessageNode.style.display = 'block';
				})
				.catch((error) => {
					console.error(error);

					form.style.display = 'none';
					errorMessageNode.style.display = 'block';
				})
				.finally(() => {
					setTimeout(() => {
						submitButton.value = submitButtonValue;
						submitButton.disabled = false;
						
						document.querySelector('.submit-button.dot-link').textContent = 'Оставить заявку';
						form.style.display = null;
						successMessageNode.style.display = null;
						errorMessageNode.style.display = null;
						$('.mag-form')[0].reset();
						document.querySelector('.form').reset();
					}, 3_000);
				});
		});
	});
}

// const formValidator = new FormValidator();

// formValidator.init().then(() => {
// 	initForms();
// });

initForms();
