import Cookies from 'js-cookie';

export const initCookies = () => {
	$(document).ready(function () {
		$('.show-coocky').on('click', function () {
			$('.popup-overlay').show();
		});

		$('#accept').on('click', function () {
			Cookies.set('alert', true, { expires: 365 });
		});

		if (!Cookies.get('alert')) {
			$('.popup-overlay').show();
		}
	});
};
