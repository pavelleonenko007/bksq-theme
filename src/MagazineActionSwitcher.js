import { getQueryParams } from "./utils";

export const initMagazineActionSwitcher = () => {
	const queryParams = getQueryParams();

	if (!queryParams.magazineAction) {
		return;
	}

	const switcherInputs = document.querySelector('.switcher').querySelectorAll('input[type="radio"][name="switcher"]');

	if (queryParams.magazineAction === 'read') {
		switcherInputs.forEach(input => {
			if (input.value === 'Где почитать') {
				input.checked = true;
			} else {
				input.checked = false;
			}
		});
	}
}