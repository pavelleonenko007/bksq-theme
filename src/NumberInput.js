export const initNumberInputs = () => {
	document.querySelectorAll('input[type="number"]').forEach((input) => {
		input.oninput = (e) => {
			e.target.value = e.target.value.replace(/\D+/g, '');
		};
	});
};
