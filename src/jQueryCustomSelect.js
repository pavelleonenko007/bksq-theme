import "jquery-custom-select";

export const initjQueryCustomSelect = () => {
	const $select = $('[data-custom="select"]');
	$select.customSelect();
};
