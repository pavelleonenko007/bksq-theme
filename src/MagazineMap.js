export function initMagazineMaps() {
	function cleanString(str) {
		return str.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
	}
	//document.addEventListener('DOMContentLoaded', function (scriptTag) {
	const SELECT_SELECTOR = '.hidden-select';
	const DROPDOWN_LINK = '.form-drop-link'; // set your dropdown item class
	const PLACEHOLDER = '.is-drop-placeholder'; // set your droptoggle placeholder class
	const ACTIVE = '.is-active1'; //set your active-link class

	const selects = document.querySelectorAll(SELECT_SELECTOR);

	selects.forEach((select) => {
		let parent = select.parentNode.parentNode;
		let dropdown = parent.querySelector('.w-dropdown');
		const options = select.querySelectorAll('option');
		const dropdownLinks = Array.from(dropdown.querySelectorAll(DROPDOWN_LINK));
		let selectedLinks = [];

		options.forEach((option) => {
			option.value = cleanString(option.value);
		});

		function setupValues() {
			const values = $(select).val();

			$(PLACEHOLDER).text(values.join(', '));

			selectedLinks = [];

			dropdownLinks.forEach((dropdownLink) => {
				dropdownLink.classList.remove(ACTIVE.replace('.', ''));
			});

			values.forEach((value) => {
				dropdownLinks.forEach((dropdownLink) => {
					if (cleanString(dropdownLink.textContent) === value) {
						dropdownLink.classList.add(ACTIVE.replace('.', ''));
						selectedLinks.push(dropdownLink);
					}
				});
			});
		}

		setupValues();

		$(select).hide();

		$(select).on('change', function () {
			setupValues();
		});

		dropdown.querySelectorAll(DROPDOWN_LINK).forEach((link) => {
			link.addEventListener('click', (e) => {
				e.preventDefault();

				if (link.classList.contains(ACTIVE.replace('.', ''))) {
					if (selectedLinks.length === 1) {
						return;
					}

					link.classList.remove(ACTIVE.replace('.', ''));
				} else {
					link.classList.add(ACTIVE.replace('.', ''));
				}

				const selectedValues = Array.from(
					dropdown.querySelectorAll(DROPDOWN_LINK + ACTIVE)
				)
					.map((dropdownLink) => dropdownLink.textContent)
					.map(cleanString);

				select.querySelectorAll('option').forEach((option) => {
					if (selectedValues.includes(cleanString(option.value))) {
						option.selected = true;
					} else {
						option.selected = false;
					}
				});

				select.dispatchEvent(new Event('change'));

				let event = new Event('w-close');

				dropdown.dispatchEvent(event);
			});
		});
	});
	//});
}
